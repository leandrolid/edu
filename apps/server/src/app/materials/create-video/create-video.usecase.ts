import type { CreateVideoInput } from '@app/materials/create-video/create-video.input'
import type { Auth } from '@domain/dtos/auth.dto'
import { ConflictError, Inject, Injectable } from '@edu/framework'
import type { IStorageService } from '@infra/services/storage/storage.service'
import type { GetMp4ProcessorOutput, IVideoService } from '@infra/services/video/video.service'

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
      await this.storageService.clear()
      const uploads = await this.processVideo({
        processors,
        buffer,
        onClose: (cb) => onClose(cb),
        slug,
      })
      const manifest = await this.videoService.generateManifest({
        maxResolution: videoInfo.video.height,
        files: uploads.map((upload) => upload.toStream()),
      })
      console.log({ manifest })
      return uploads
    } catch (error) {
      console.error(error)
      processors.map((processor) => processor.onError(error))
      throw new ConflictError('Erro ao processar o vídeo')
    }
  }

  private async processVideo({
    processors,
    buffer,
    onClose,
    slug,
  }: {
    processors: GetMp4ProcessorOutput[]
    buffer: Buffer
    onClose: (cb: () => void) => void
    slug: string
  }) {
    const uuid = crypto.randomUUID()
    return Promise.all(
      processors.map(async (processor) => {
        onClose(() => processor.onError())
        processor.process(buffer)
        const upload = await this.storageService.uploadStream({
          key: `${slug}/videos/${uuid}/${processor.resolution}.${processor.extension}`,
          stream: processor.toStream(),
        })
        return upload
      }),
    )
  }
}
