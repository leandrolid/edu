import type { StreamVideoInput } from '@app/materials/stream-video/stream-video.input'
import { BadRequestError, Inject, Injectable } from '@edu/framework'
import type { IStorageService } from '@infra/services/storage/storage.service'

const ONE_MEGABYTE = 10e5

@Injectable()
export class StreamVideoUseCase {
  constructor(
    @Inject('IStorageService')
    private readonly storageService: IStorageService,
  ) {}

  async execute({ range: start, videoId, slug }: StreamVideoInput) {
    if (start === null || start === undefined) {
      throw new BadRequestError('Range header is required for video streaming')
    }
    const video = await this.storageService.getOne(`${slug}/videos/${videoId}`)
    const end = Math.min(start + ONE_MEGABYTE, video.size - 1)
    const videoStream = video.toStream({ start, end })
    return {
      videoStream,
      start,
      end,
      videoSize: video.size,
      contentLength: end - start + 1,
    }
  }
}
