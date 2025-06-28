import type { Filter } from '@domain/persistence/filter'
import type { IRepository } from '@domain/persistence/repository'
import { Injectable } from '@edu/framework'
import { InjectRepository } from '@infra/database/decorators/inject-repository'
import type {
  CreateVideoInput,
  FindManyVideosAndCountInput,
  FindManyVideosAndCountOutput,
  IVideoRepository,
  UpdateDurationAndThumbnailInput,
} from '@infra/repositories/video/video.repository'
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

  async findManyAndCount(
    input: FindManyVideosAndCountInput,
  ): Promise<FindManyVideosAndCountOutput> {
    const where: Filter<Video> = {
      organizationId: input.organizationId,
      or: [{ title: { ilike: input.search } }, { description: { ilike: input.search } }],
    }
    const [videos, count] = await Promise.all([
      this.repository.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        take: input.pageSize,
        skip: (input.page - 1) * input.pageSize,
      }),
      this.repository.count({ where }),
    ])
    return { count, videos }
  }

  async findById(id: string): Promise<Video | null> {
    return this.repository.findById(id)
  }

  async updateDurationAndThumbnail(input: UpdateDurationAndThumbnailInput): Promise<Video> {
    return this.repository.updateOne({
      id: input.id,
      data: {
        duration: input.duration,
        thumbnail: input.thumbnail,
      },
    })
  }

  async deleteById(id: string): Promise<void> {
    await this.repository.deleteById(id)
  }
}
