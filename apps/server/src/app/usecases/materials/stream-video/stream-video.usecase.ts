import type { StreamVideoInput } from '@app/usecases/materials/stream-video/stream-video.input'
import { Inject, Injectable } from '@edu/framework'
import type { IStorageService } from '@infra/services/storage/storage.service'

const ONE_MEGABYTE = 10e5
const RESOLUTIONS = [
  { label: '1080p', minMbps: 7, path: '1080p' },
  { label: '720p', minMbps: 3, path: '720p' },
  { label: '480p', minMbps: 1.5, path: '480p' },
  { label: '360p', minMbps: 0.8, path: '360p' },
  { label: '240p', minMbps: 0.4, path: '240p' },
  { label: '144p', minMbps: 0, path: '144p' },
]

@Injectable()
export class StreamVideoUseCase {
  constructor(
    @Inject('IStorageService')
    private readonly storageService: IStorageService,
  ) {}

  async execute({ range, videoId, slug, fileName }: StreamVideoInput) {
    const video = await this.storageService.getOne(`${slug}/videos/${videoId}/${fileName}`)
    if (!range || !range.match(/bytes=(\d+)-(\d+)?/)) {
      return {
        videoStream: video.toStream(),
        start: 0,
        end: video.size - 1,
        videoSize: video.size,
        contentLength: video.size,
        contentType: video.mimetype,
      }
    }
    const [, rangeStart, rangeEnd] = range.match(/bytes=(\d+)-(\d+)?/)!
    const start = Number(rangeStart) || 0
    const end = Number(rangeEnd) || Math.min(start + ONE_MEGABYTE, video.size - 1)
    const videoStream = video.toStream({ start: start, end })
    return {
      videoStream,
      start,
      end,
      videoSize: video.size,
      contentLength: end - start + 1,
      contentType: video.mimetype,
    }
  }

  private getResolutionBySpeed({
    networkSpeedMbps,
    availableResolutions,
  }: {
    networkSpeedMbps: number
    availableResolutions: string[]
  }): string {
    const resolution = RESOLUTIONS.filter((res) => availableResolutions.includes(res.path)).find(
      (res) => networkSpeedMbps >= res.minMbps,
    )
    return resolution ? resolution.path : availableResolutions[0]!
  }
}
