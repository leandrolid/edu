import type { GetVideosInput } from '@app/usecases/videos/get-videos/get-videos.input'
import type { Auth } from '@domain/dtos/auth.dto'
import { Inject, Injectable } from '@edu/framework'
import type { IVideoRepository } from '@infra/repositories/video/video.repository'

@Injectable()
export class GetVideosUseCase {
  constructor(
    @Inject('IVideoRepository')
    private readonly videoRepository: IVideoRepository,
  ) {}

  async execute({ search, page, pageSize, user }: Auth<GetVideosInput>) {
    const { videos, count } = await this.videoRepository.findManyAndCount({
      organizationId: user.organizationId!,
      search,
      page,
      pageSize,
    })
    return {
      metadata: {
        page,
        pageSize,
        total: count,
        totalPages: Math.ceil(count / pageSize),
      },
      videos: videos.map((video) => ({
        ...video,
        thumbnail: new URL(video.thumbnail, video.baseUrl).toString(),
      })),
    }
  }
}
