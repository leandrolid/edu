import type { CreateVideoInput } from '@app/materials/create-video/create-video.input'
import type { Auth } from '@domain/dtos/auth.dto'
import { ConflictError, Inject, Injectable } from '@edu/framework'
import type { IStorageService } from '@infra/services/storage/storage.service'
import type { IVideoService } from '@infra/services/video/video.service'

@Injectable()
export class CreateVideoUseCase {
  constructor(
    @Inject('IStorageService')
    private readonly storageService: IStorageService,
    @Inject('IVideoService')
    private readonly videoService: IVideoService,
  ) {}

  async execute({ file, slug, onClose }: Auth<CreateVideoInput>) {
    const buffer = await file.getBuffer()
    const videoInfo = await this.videoService.getInfo({ buffer })
    const processors = this.videoService.getMp4Processors({
      maxResolution: videoInfo.video.height,
    })
    try {
      const uploads = await Promise.all(
        processors.map((processor) => {
          onClose(() => processor.onError())
          processor.process(buffer)
          return this.storageService.uploadStream({
            key: `${slug}/videos/${processor.resolution}/output.mp4`,
            stream: processor.toStream(),
          })
        }),
      )
      return uploads
    } catch (error) {
      console.error(error)
      processors.map((processor) => processor.onError(error))
      throw new ConflictError('Erro ao processar o vídeo')
    }
  }
}
