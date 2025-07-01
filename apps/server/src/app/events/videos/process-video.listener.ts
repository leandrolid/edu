import { VideoEvent } from '@app/events/videos/video.event'
import { RESOLUTIONS } from '@domain/constants/resolutions'
import type { IQueueService } from '@domain/services/queue.service'
import { Injectable, OnEvent } from '@edu/framework'
import { InjectQueue } from '@infra/decorators/inject-queue.decorator'
import {
  PROCESS_VIDEO_QUEUE,
  type VideoProcessorInput,
  VideoProcessorJob,
} from '@infra/services/jobs/process-video.job'

@Injectable()
export class ProcessVideoListener {
  constructor(
    @InjectQueue(PROCESS_VIDEO_QUEUE)
    private readonly videoProcessorQueue: IQueueService<VideoProcessorInput>,
    private readonly videoProcessorJob: VideoProcessorJob,
  ) {}

  @OnEvent(VideoEvent.UPLOADED)
  async onVideoUploaded(videoEvent: VideoEvent) {
    await this.videoProcessorQueue.addMany(
      RESOLUTIONS.map((resolution) => ({
        name: resolution.label,
        data: {
          ...videoEvent,
          resolution: resolution.label,
        },
      })),
    )
  }

  @OnEvent(VideoEvent.PROCESSED)
  async onVideoProcessed(videoEvent: VideoEvent) {
    console.log({
      message: 'Video processed successfully',
      videoId: videoEvent.videoId,
      assetId: videoEvent.assetId,
      slug: videoEvent.slug,
    })
  }

  // @OnEvent('video.resized')
  // async onVideoProcessed({
  //   id,
  //   key,
  //   processedFiles,
  // }: {
  //   id: string
  //   key: string
  //   processedFiles: string[]
  // }) {
  //   try {
  //     const files = await this.storageService.getMany(processedFiles)
  //     const fileDirectory = key.split('/').slice(0, -1).join('/')
  //     const manifest = await this.videoService.createManifest({
  //       files: files.map((file) => ({
  //         name: file.key.split('/').pop() || '',
  //         toStream: () => file.toStream(),
  //       })),
  //     })
  //     const manifestUpload = await this.storageService.uploadStream({
  //       key: `${fileDirectory}/manifest.mpd`,
  //       stream: manifest.file.toStream(),
  //     })
  //     await manifest.close()
  //     await this.eventsService.emit('video.processed', {
  //       id,
  //       key,
  //       manifest: manifestUpload.key,
  //       files: processedFiles,
  //     })
  //   } catch (error) {
  //     console.error('Error processing video:', error)
  //     throw new BadRequestError('Erro ao processar o vídeo')
  //   }
  // }

  // @OnEvent('video.processed')
  // async onVideoManifested({
  //   id,
  //   key,
  //   manifest,
  //   files,
  // }: {
  //   id: string
  //   key: string
  //   manifest: string
  //   files: string[]
  // }) {
  //   console.log({
  //     message: 'Vídeo processado com sucesso',
  //     id,
  //     key,
  //     manifest,
  //     files,
  //   })
  // }
}
