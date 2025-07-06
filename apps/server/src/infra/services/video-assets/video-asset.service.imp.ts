import { RESOLUTIONS } from '@domain/constants/resolutions'
import { BadRequestError, Injectable, Logger } from '@edu/framework'
import { FfProbeBuilder } from '@infra/adapters/ffmpeg/ffprobe.builder'
import type {
  CreateAssetInput,
  GetAllAssetsIdInput,
  GetAssetIdInput,
  GetInfoInput,
  GetVideoInfoOutput,
  IVideoAssetService,
} from '@infra/services/video-assets/video-asset.service'
import { Readable } from 'node:stream'

@Injectable({
  token: 'IVideoAssetService',
})
export class VideoAssetService implements IVideoAssetService {
  private readonly logger: Logger = new Logger(VideoAssetService.name)
  public createPath({ slug, videoId, name }: CreateAssetInput): string {
    return `organizations/${slug}/videos/${videoId}/${name}`
  }

  public getResolutionPath({ slug, videoId, resolution }: GetAssetIdInput) {
    return `organizations/${slug}/videos/${videoId}/${resolution}.webm`
  }

  public getAllResolutionsPath({ slug, videoId }: GetAllAssetsIdInput) {
    return RESOLUTIONS.map((resolution) => {
      return this.getResolutionPath({
        slug,
        videoId,
        resolution: resolution.label,
      })
    })
  }

  public async getInfo(input: GetInfoInput): Promise<GetVideoInfoOutput> {
    const stream = Readable.from(input.buffer)
    const ffprobe = FfProbeBuilder.init(this.logger)
      .addLogLevel('error')
      .addPrintFormat('json')
      .addShowFormat()
      .addShowStreams()
      .addInput('pipe:0')
      .build()
    stream.pipe(ffprobe.input)
    const data = await ffprobe.toPromise()
    const videoStream = data.streams.find((stream: any) => stream.codec_type === 'video')
    if (!videoStream) {
      throw new BadRequestError('Arquivo de vídeo inválido ou corrompido')
    }
    const audioStream = data.streams.find((stream: any) => stream.codec_type === 'audio')
    return {
      format: {
        filename: data.format.filename,
        duration: parseFloat(data.format.duration),
        size: data.format.size ? parseInt(data.format.size, 10) : 0,
        bitrate: data.format.bit_rate ? parseInt(data.format.bit_rate, 10) : 0,
      },
      video: {
        width: videoStream.width,
        height: videoStream.height,
        codecName: videoStream.codec_name,
        codecType: videoStream.codec_type,
        bitRate: parseInt(videoStream.bit_rate, 10),
        duration: parseFloat(videoStream.duration),
      },
      audio: audioStream
        ? {
            codecName: audioStream.codec_name,
            codecType: audioStream.codec_type,
            bitRate: parseInt(audioStream.bit_rate, 10),
            duration: parseFloat(audioStream.duration),
          }
        : null,
    }
  }
}
