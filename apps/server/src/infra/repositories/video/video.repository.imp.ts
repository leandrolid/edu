import type { IRepository } from '@domain/persistence/repository'
import { Injectable } from '@edu/framework'
import { InjectRepository } from '@infra/database/decorators/inject-repository'
import type { CreateVideoInput, IVideoRepository } from '@infra/repositories/video/video.repository'
import type { Video } from '@prisma/client'

@Injectable({
  token: 'IVideoRepository',
})
export class VideoRepository implements IVideoRepository {
  constructor(
    @InjectRepository('Video')
    private readonly repository: IRepository<Video>,
  ) {}

  async createOne(input: CreateVideoInput): Promise<Video> {
    return this.repository.createOne({
      id: input.id,
      title: input.title,
      ownerId: input.ownerId,
      organizationId: input.organizationId,
      assetId: input.assetId,
      baseUrl: input.baseUrl,
      duration: input.duration,
      thumbnail: input.thumbnail,
    })
  }
}
