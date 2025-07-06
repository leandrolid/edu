import { VideoEvent } from '@app/events/videos/video.event'
import type { CreateVideosInput } from '@app/usecases/videos/create-videos/create-videos.input'
import type { Auth } from '@domain/dtos/auth.dto'
import { EVENT_SERVICE, Inject, Injectable, type IEventsService } from '@edu/framework'
import type { IVideoRepository } from '@infra/repositories/video/video.repository'
import type { IStorageService } from '@infra/services/storage/storage.service'
import type { IUIDService } from '@infra/services/uid/uid.service'
import type { IVideoAssetService } from '@infra/services/video-assets/video-asset.service'

@Injectable()
export class CreateVideosUseCase {
  constructor(
    @Inject('IStorageService')
    private readonly storageService: IStorageService,
    @Inject(EVENT_SERVICE)
    private readonly eventsService: IEventsService,
    @Inject('IUIDService')
    private readonly uidService: IUIDService,
    @Inject('IVideoRepository')
    private readonly videoRepository: IVideoRepository,
    @Inject('IVideoAssetService')
    private readonly videoAssetService: IVideoAssetService,
  ) {}

  async execute({ videos, user }: Auth<CreateVideosInput>) {
    const uploadedVideos = await Promise.all(
      videos.map(async (video) => {
        const videoId = this.uidService.uuid()
        const buffer = await video.file.toBuffer()
        const videoInfo = await this.videoAssetService.getInfo({ buffer })
        const upload = await this.storageService.uploadOne({
          buffer,
          key: this.videoAssetService.createPath({
            slug: user.slug!,
            videoId,
            name: `original.${video.file.filename.split('.').pop() || 'mp4'}`,
          }),
        })
        const material = await this.videoRepository.createOne({
          id: videoId,
          title: video.title,
          ownerId: user.id,
          organizationId: user.organizationId!,
          assetId: upload.key,
          baseUrl: 'http://localhost:3333',
          duration: Math.ceil(videoInfo.video.duration),
          thumbnail: '',
        })
        await this.eventsService.emit(
          VideoEvent.UPLOADED,
          VideoEvent.create({
            assetId: upload.key,
            videoId: material.id,
            slug: user.slug!,
          }),
        )
        return {
          id: material.id,
          url: upload.url,
        }
      }),
    )
    return {
      uploadedVideos,
    }
  }
}
