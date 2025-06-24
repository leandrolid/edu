import type { CreateVideoInput } from '@app/materials/create-video/create-video.input'
import type { Auth } from '@domain/dtos/auth.dto'
import { EVENT_SERVICE, Inject, Injectable, type IEventsService } from '@edu/framework'
import type { IStorageService } from '@infra/services/storage/storage.service'

@Injectable()
export class CreateVideoUseCase {
  constructor(
    @Inject('IStorageService')
    private readonly storageService: IStorageService,
    @Inject(EVENT_SERVICE)
    private readonly eventsService: IEventsService,
  ) {}

  async execute({ file, slug }: Auth<CreateVideoInput>) {
    await this.storageService.clear()
    const stream = file.toStream()
    const material = {
      id: crypto.randomUUID(),
    }
    const upload = await this.storageService.uploadStream({
      key: `${slug}/videos/${material.id}/${file.filename}`,
      stream,
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
