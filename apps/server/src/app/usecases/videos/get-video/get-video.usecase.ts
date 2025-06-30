import type { GetVideoInput } from '@app/usecases/videos/get-video/get-video.input'
import type { Auth } from '@domain/dtos/auth.dto'
import { Inject, Injectable, NotFoundError } from '@edu/framework'
import type { IVideoRepository } from '@infra/repositories/video/video.repository'

@Injectable()
export class GetVideoUseCase {
  constructor(
    @Inject('IVideoRepository')
    private readonly videoRepository: IVideoRepository,
  ) {}

  async execute({ videoId, user }: Auth<GetVideoInput>) {
    const video = await this.videoRepository.findById(videoId)
    if (!video) throw new NotFoundError('Video não encontrado')
    return {
      video: {
        ...video,
        thumbnail: new URL(video.thumbnail, video.baseUrl).toString(),
        url: new URL(
          `${video.assetId.split('/').slice(0, -1).join('/')}/manifest.mpd`,
          video.baseUrl,
        ).toString(),
      },
    }
  }
}
