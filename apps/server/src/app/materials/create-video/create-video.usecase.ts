import type { CreateVideoInput } from '@app/materials/create-video/create-video.input'
import type { Auth } from '@domain/dtos/auth.dto'
import { BadRequestError, ConflictError, Inject, Injectable } from '@edu/framework'
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
    await this.storageService.clear()
    const buffer = await file.getBuffer()
    const videoInfo = await this.videoService.getInfo({ buffer })
    if (!videoInfo.audio) throw new BadRequestError('Vídeo sem áudio não é suportado')
    const processor = await this.videoService.processFile({
      buffer,
      maxResolution: videoInfo.video.height,
    })
    try {
      const uuid = crypto.randomUUID()
      const uploads = await Promise.all(
        processor.files.map(async (file) => {
          return await this.storageService.uploadStream({
            key: `${slug}/videos/${uuid}/${file.name}`,
            stream: file.toStream(),
          })
        }),
      )
      const manifest = await this.videoService.createManifest({
        maxResolution: videoInfo.video.height,
        files: processor.files,
      })
      const manifestUpload = await this.storageService.uploadStream({
        key: `${slug}/videos/${uuid}/manifest.mpd`,
        stream: manifest.file.toStream(),
      })
      await processor.close()
      await manifest.close()
      return {
        video: {
          id: uuid,
          slug,
          duration: videoInfo.format.duration,
          size: videoInfo.format.size,
          bitrate: videoInfo.format.bitrate,
          width: videoInfo.video.width,
          height: videoInfo.video.height,
          codecName: videoInfo.video.codecName,
          codecType: videoInfo.video.codecType,
          audioCodecName: videoInfo.audio?.codecName ?? null,
          audioCodecType: videoInfo.audio?.codecType ?? null,
          audioBitRate: videoInfo.audio?.bitRate ?? null,
          audioDuration: videoInfo.audio?.duration ?? null,
        },
        uploads: uploads.map((upload) => upload.url),
        manifestUrl: manifestUpload.url,
      }
    } catch (error) {
      console.error(error)
      onClose(() => {
        processor.close()
      })
      throw new ConflictError('Erro ao processar o vídeo')
    }
  }
}
