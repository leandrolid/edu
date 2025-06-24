import { BadRequestError, ConflictError, Inject, Injectable, OnEvent } from '@edu/framework'
import type { IStorageService } from '@infra/services/storage/storage.service'
import type { IVideoService } from '@infra/services/video/video.service'

export type PrepareStreamInput = {
  id: string
  slug: string
  key: string
}

@Injectable()
export class ProcessVideoListener {
  constructor(
    @Inject('IVideoService')
    private readonly videoService: IVideoService,
    @Inject('IStorageService')
    private readonly storageService: IStorageService,
  ) {}

  @OnEvent('video.uploaded')
  async execute({ id, key, slug }: PrepareStreamInput) {
    console.log('Processing video', { id, key, slug })
    const originalFile = await this.storageService.getOne(key)
    const buffer = await originalFile.toBuffer()
    const videoInfo = await this.videoService.getInfo({ buffer })
    if (!videoInfo.audio) throw new BadRequestError('Vídeo sem áudio não é suportado')
    const processor = await this.videoService.processFile({
      buffer,
      maxResolution: videoInfo.video.height,
    })
    try {
      const fileDirectory = key.split('/').slice(0, -2).join('/')
      const uploads = await Promise.all(
        processor.files.map(async (file) => {
          return await this.storageService.uploadStream({
            key: `${fileDirectory}/${file.name}`,
            stream: file.toStream(),
          })
        }),
      )
      const manifest = await this.videoService.createManifest({
        maxResolution: videoInfo.video.height,
        files: processor.files,
      })
      const manifestUpload = await this.storageService.uploadStream({
        key: `${fileDirectory}/manifest.mpd`,
        stream: manifest.file.toStream(),
      })
      await processor.close()
      await manifest.close()
      console.log({
        video: { id, slug },
        uploads: uploads.map((upload) => upload.url),
        manifestUrl: manifestUpload.url,
      })
      return {
        video: { id, slug },
        uploads: uploads.map((upload) => upload.url),
        manifestUrl: manifestUpload.url,
      }
    } catch (error) {
      console.error(error)
      processor.close()
      throw new ConflictError('Erro ao processar o vídeo')
    }
  }
}
