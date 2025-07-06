import { VideoEvent } from '@app/events/videos/video.event'
import { RESOLUTIONS } from '@domain/constants/resolutions'
import type { IQueueService } from '@domain/services/queue.service'
import { Inject, Injectable, OnEvent } from '@edu/framework'
import { InjectQueue } from '@infra/decorators/inject-queue.decorator'
import {
  CREATE_MANIFEST_QUEUE,
  type CreateManifestInput,
  CreateManifestJob,
} from '@infra/services/jobs/create-manifest.job'
import {
  PROCESS_VIDEO_QUEUE,
  type VideoProcessorInput,
  VideoProcessorJob,
} from '@infra/services/jobs/process-video.job'
import type { IStorageService } from '@infra/services/storage/storage.service'
import type { IVideoAssetService } from '@infra/services/video-assets/video-asset.service'

@Injectable()
export class ProcessVideoListener {
  constructor(
    @InjectQueue(PROCESS_VIDEO_QUEUE)
    private readonly videoProcessorQueue: IQueueService<VideoProcessorInput>,
    @InjectQueue(CREATE_MANIFEST_QUEUE)
    private readonly createManifestQueue: IQueueService<CreateManifestInput>,
    @Inject('IVideoAssetService')
    private readonly videoAssetService: IVideoAssetService,
    @Inject('IStorageService')
    private readonly storageService: IStorageService,
    private readonly videoProcessorJob: VideoProcessorJob,
    private readonly createManifestJob: CreateManifestJob,
  ) {}

  @OnEvent(VideoEvent.UPLOADED)
  async onVideoUploaded(videoEvent: VideoEvent) {
    await this.videoProcessorQueue.addMany(
      RESOLUTIONS.map((resolution) => ({
        name: `${videoEvent.videoId}-${resolution.label}`,
        data: {
          ...videoEvent,
          resolution: resolution.label,
        },
      })),
    )
  }

  @OnEvent(VideoEvent.PROCESSED)
  async onVideoProcessed(videoEvent: VideoEvent) {
    const assetsId = this.videoAssetService.getAllResolutionsPath({
      videoId: videoEvent.videoId,
      slug: videoEvent.slug,
    })
    const allAssetsExist = await this.storageService.existMany(assetsId)
    if (!allAssetsExist) return
    await this.createManifestQueue.add(`${videoEvent.videoId}-manifest`, {
      videoId: videoEvent.videoId,
      assetsId,
      slug: videoEvent.slug,
    })
  }

  @OnEvent(VideoEvent.MANIFEST_CREATED)
  async onVideoManifestCreated(videoEvent: VideoEvent) {}
}
