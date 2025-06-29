import type { CreateVideoInput } from '@app/usecases/videos/create-video/create-video.input'
import type { Auth } from '@domain/dtos/auth.dto'
import { EVENT_SERVICE, Inject, Injectable, type IEventsService } from '@edu/framework'
import type { IVideoRepository } from '@infra/repositories/video/video.repository'
import type { IStorageService } from '@infra/services/storage/storage.service'
import type { IUIDService } from '@infra/services/uid/uid.service'

@Injectable()
export class CreateVideoUseCase {
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

  async execute({ file, slug, user }: Auth<CreateVideoInput>) {
    const stream = file.toStream()
    const videoId = this.uidService.uuid()
    const upload = await this.storageService.uploadStream({
      key: `${slug}/videos/${videoId}/original.${file.filename.split('.').pop() || 'mp4'}`,
      stream,
    })
    const material = await this.videoRepository.createOne({
      id: videoId,
      title: file.filename,
      ownerId: user.id,
      organizationId: user.organizationId!,
      assetId: upload.key,
      baseUrl: 'http://192.168.0.20:3333',
      duration: 0,
      thumbnail: '',
    })
    await this.eventsService.emit('video.uploaded', {
      id: material.id,
      slug,
      key: upload.key,
    })
    return {
      id: material.id,
      url: upload.url,
    }
  }
}
