import {
  BadRequestError,
  ConflictError,
  EVENT_SERVICE,
  Inject,
  Injectable,
  OnEvent,
  type IEventsService,
} from '@edu/framework'
import type { IVideoRepository } from '@infra/repositories/video/video.repository'
import type { IStorageService } from '@infra/services/storage/storage.service'
import type { IVideoService } from '@infra/services/video/video.service'

@Injectable()
export class ProcessVideoListener {
  constructor(
    @Inject('IVideoService')
    private readonly videoService: IVideoService,
    @Inject('IVideoRepository')
    private readonly videoRepository: IVideoRepository,
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
      const thumbnail = await this.videoService.createThumbnail({
        buffer,
      })
      const fileDirectory = key.split('/').slice(0, -1).join('/')
      const thumbnailUpload = await this.storageService.uploadStream({
        key: `${fileDirectory}/thumbnail.jpg`,
        stream: thumbnail.file.toStream(),
      })
      await thumbnail.close()
      await this.videoRepository.updateDurationAndThumbnail({
        id,
        duration: videoInfo.video.duration,
        thumbnail: thumbnailUpload.key,
      })
      const variants = await this.videoService.createVariants({
        buffer,
        maxResolution: videoInfo.video.height,
      })
      const processedFiles = await Promise.all(
        variants.files.map(async (file) => {
          const upload = await this.storageService.uploadStream({
            key: `${fileDirectory}/${file.name}`,
            stream: file.toStream(),
          })
          return upload.key
        }),
      )
      await variants.close()
      await this.eventsService.emit('video.resized', {
        id,
        key,
        processedFiles,
      })
    } catch (error) {
      console.error(error)
      throw new ConflictError('Erro ao processar o vídeo')
    }
  }

  @OnEvent('video.resized')
  async onVideoProcessed({
    id,
    key,
    processedFiles,
  }: {
    id: string
    key: string
    processedFiles: string[]
  }) {
    try {
      const files = await this.storageService.getMany(processedFiles)
      const fileDirectory = key.split('/').slice(0, -1).join('/')
      const manifest = await this.videoService.createManifest({
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
      await this.eventsService.emit('video.processed', {
        id,
        key,
        manifest: manifestUpload.key,
        files: processedFiles,
      })
    } catch (error) {
      console.error('Error processing video:', error)
      throw new BadRequestError('Erro ao processar o vídeo')
    }
  }

  @OnEvent('video.processed')
  async onVideoManifested({
    id,
    key,
    manifest,
    files,
  }: {
    id: string
    key: string
    manifest: string
    files: string[]
  }) {
    console.log({
      message: 'Vídeo processado com sucesso',
      id,
      key,
      manifest,
      files,
    })
  }
}
