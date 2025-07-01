import { VideoEvent } from '@app/events/videos/video.event'
import type { CreateVideosInput } from '@app/usecases/videos/create-videos/create-videos.input'
import type { Auth } from '@domain/dtos/auth.dto'
import { EVENT_SERVICE, Inject, Injectable, type IEventsService } from '@edu/framework'
import type { IVideoRepository } from '@infra/repositories/video/video.repository'
import type { IStorageService } from '@infra/services/storage/storage.service'
import type { IUIDService } from '@infra/services/uid/uid.service'

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
  ) {}

  async execute({ videos, user }: Auth<CreateVideosInput>) {
    const uploadedVideos = await Promise.all(
      videos.map(async (video) => {
        const videoId = this.uidService.uuid()
        const upload = await this.storageService.uploadOne({
          key: `organizations/${user.slug}/videos/${videoId}/original.${video.file.filename.split('.').pop() || 'mp4'}`,
          buffer: await video.file.toBuffer(),
        })
        const material = await this.videoRepository.createOne({
          id: videoId,
          title: video.title,
          ownerId: user.id,
          organizationId: user.organizationId!,
          assetId: upload.key,
          baseUrl: 'http://localhost:3333',
          duration: video.duration || 0,
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
