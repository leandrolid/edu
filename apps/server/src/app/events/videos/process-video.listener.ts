import {
  BadRequestError,
  ConflictError,
  EVENT_SERVICE,
  Inject,
  Injectable,
  OnEvent,
  type IEventsService,
} from '@edu/framework'
import type { IStorageService } from '@infra/services/storage/storage.service'
import type { IVideoService } from '@infra/services/video/video.service'

@Injectable()
export class ProcessVideoListener {
  constructor(
    @Inject('IVideoService')
    private readonly videoService: IVideoService,
    @Inject('IStorageService')
    private readonly storageService: IStorageService,
    @Inject(EVENT_SERVICE)
    private readonly eventsService: IEventsService,
  ) {}

  @OnEvent('video.uploaded')
  async onVideoUploaded({ id, key }: { id: string; key: string }) {
    try {
      const originalFile = await this.storageService.getOne(key)
      const buffer = await originalFile.toBuffer()
      const videoInfo = await this.videoService.getInfo({ buffer })
      if (!videoInfo.audio) throw new BadRequestError('Vídeo sem áudio não é suportado')
      const processor = await this.videoService.processFile({
        buffer,
        maxResolution: videoInfo.video.height,
      })
      const fileDirectory = key.split('/').slice(0, -2).join('/')
      const uploads = await Promise.all(
        processor.files.map(async (file) => {
          return await this.storageService.uploadStream({
            key: `${fileDirectory}/${file.name}`,
            stream: file.toStream(),
          })
        }),
      )
      await processor.close()
      await this.eventsService.emit('video.processed', {
        id,
        key,
        maxResolution: videoInfo.video.height,
        uploads: uploads.map((upload) => upload.key),
      })
    } catch (error) {
      console.error(error)
      throw new ConflictError('Erro ao processar o vídeo')
    }
  }

  @OnEvent('video.processed')
  async onVideoProcessed({
    key,
    uploads,
    maxResolution,
  }: {
    id: string
    key: string
    maxResolution: number
    uploads: string[]
  }) {
    try {
      const files = await this.storageService.getMany(uploads)
      const fileDirectory = key.split('/').slice(0, -2).join('/')
      const manifest = await this.videoService.createManifest({
        maxResolution,
        files: files.map((file) => ({
          name: file.key.split('/').pop() || '',
          toStream: () => file.toStream(),
        })),
      })
      const manifestUpload = await this.storageService.uploadStream({
        key: `${fileDirectory}/manifest.mpd`,
        stream: manifest.file.toStream(),
      })
      await manifest.close()
    } catch (error) {
      console.error('Error processing video:', error)
      throw new BadRequestError('Erro ao processar o vídeo')
    }
  }
}
