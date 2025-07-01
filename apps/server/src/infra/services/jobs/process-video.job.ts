import { VideoEvent } from '@app/events/videos/video.event'
import type { IJobService, ProcessInput } from '@domain/services/queue.service'
import {
  ConflictError,
  EVENT_SERVICE,
  Inject,
  Injectable,
  Logger,
  type IEventsService,
} from '@edu/framework'
import { BullJobAdapter } from '@infra/adapters/bull/job.adapter'
import { FfmpegBuilder } from '@infra/adapters/ffmpeg/ffmpeg.builder'
import type { IStorageService } from '@infra/services/storage/storage.service'
import { capitalize } from 'radash'

export const PROCESS_VIDEO_QUEUE = 'process-video'

export type VideoProcessorInput = {
  videoId: string
  assetId: string
  slug: string
  resolution: '144p' | '240p' | '360p' | '480p' | '720p' | '1080p' | 'audio'
}

@Injectable()
export class VideoProcessorJob
  extends BullJobAdapter<VideoProcessorInput>
  implements IJobService<VideoProcessorInput>
{
  private readonly logger: Logger = new Logger(VideoProcessorJob.name)
  constructor(
    @Inject('IStorageService')
    private readonly storageService: IStorageService,
    @Inject(EVENT_SERVICE)
    private readonly eventsService: IEventsService,
  ) {
    super(PROCESS_VIDEO_QUEUE)
  }

  async process({
    data: { videoId, assetId, slug, resolution },
  }: ProcessInput<VideoProcessorInput>): Promise<void> {
    try {
      const originalFile = await this.storageService.getOne(assetId)
      const stream = originalFile.toStream()
      const ffmpeg = FfmpegBuilder.init(this.logger)
        .input('pipe:0')
        .toDash()
        [`to${this.capitalizeResolution(resolution)}`]('pipe:1')
        .build()
      stream.pipe(ffmpeg.input)
      const resized = await this.storageService.uploadStream({
        key: `${assetId.split('/').slice(0, -1).join('/')}/${resolution}.webm`,
        stream: ffmpeg.output,
      })
      await ffmpeg.toPromise()
      await this.eventsService.emit(
        VideoEvent.PROCESSED,
        VideoEvent.create({
          assetId,
          videoId,
          slug,
        }),
      )
      this.logger.success(`Vídeo processado para ${resolution}:`, resized.key)
    } catch (error) {
      console.error(error)
      throw new ConflictError('Erro ao processar o vídeo')
    }
  }

  private capitalizeResolution<Resolution extends VideoProcessorInput['resolution']>(
    resolution: Resolution,
  ): Capitalize<Resolution> {
    return capitalize(resolution) as Capitalize<Resolution>
  }
}
