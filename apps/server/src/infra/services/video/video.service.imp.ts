import {
  BadRequestError,
  Injectable,
  InternalServerError,
  Logger,
  type IReadStream,
} from '@edu/framework'
import { FfmpegBuilder } from '@infra/adapters/ffmpeg/ffmpeg.builder'
import { FfProbeBuilder } from '@infra/adapters/ffmpeg/ffprobe.builder'
import type {
  GetMp4ProccessorsForResolutionsInput,
  GetMp4ProcessorOutput,
  GetVideoInfoOutput,
  IVideoService,
  Resolution,
} from '@infra/services/video/video.service'

const RESOLUTIONS = [
  { label: '1080p', height: 1080, bitrate: '5000k' },
  { label: '720p', height: 720, bitrate: '3000k' },
  { label: '480p', height: 480, bitrate: '1500k' },
  { label: '360p', height: 360, bitrate: '800k' },
  { label: '240p', height: 240, bitrate: '500k' },
  { label: '144p', height: 144, bitrate: '200k' },
]

@Injectable({
  token: 'IVideoService',
})
export class FfmpegService implements IVideoService {
  private readonly logger = new Logger('FFmpeg')

  public getMp4Processor(): GetMp4ProcessorOutput {
    const ffmpeg = FfmpegBuilder.init(this.logger)
      .addInput('pipe:0')
      .addAccel('cuda')
      .addVideoCodec('libx264')
      .addAudioCodec('aac')
      .addMovFlags('frag_keyframe+empty_moov+default_base_moof')
      // .addBitrate('5000k')
      // .addMaxRate('5000k')
      .addBufSize('1000k')
      .addFormat('mp4')
      .addOutput('pipe:1')
      .build()
    return {
      resolution: 'original',
      in: ffmpeg.stdin,
      out: ffmpeg.stdout,
      kill: () => ffmpeg.kill(),
      onError: (error?: unknown) => {
        ffmpeg.stdout.destroy(error as Error)
        ffmpeg.stdin.destroy(error as Error)
        ffmpeg.kill()
      },
    }
  }

  public getMp4Processors(input: GetMp4ProccessorsForResolutionsInput): GetMp4ProcessorOutput[] {
    return RESOLUTIONS.filter((resolution) => resolution.height <= input.maxResolution).map(
      ({ height, bitrate, label }) => {
        const ffmpeg = FfmpegBuilder.init(this.logger)
          .addInput('pipe:0')
          .addVideoCodec('libx264')
          .addAudioCodec('aac')
          .addMovFlags('frag_keyframe+empty_moov+default_base_moof')
          .addBitrate(bitrate)
          .addMaxRate(bitrate)
          .addBufSize('1000k')
          // .addVideoFilter(`scale=-2:min(${height}\\,ih)`)
          .addFormat('mp4')
          .addOutput('pipe:1')
          .build()
        return {
          resolution: label as Resolution,
          in: ffmpeg.stdin,
          out: ffmpeg.stdout,
          kill: () => ffmpeg.kill(),
          onError: (error?: unknown) => {
            ffmpeg.stdout.destroy(error as Error)
            ffmpeg.stdin.destroy(error as Error)
            ffmpeg.kill()
          },
        }
      },
    )
  }

  public async getInfo(stream: IReadStream): Promise<GetVideoInfoOutput> {
    const ffprobe = FfProbeBuilder.init(this.logger)
      .addLogLevel('error')
      .addPrintFormat('json')
      .addShowFormat()
      .addShowStreams()
      .addInput('pipe:0')
      .build()
    return new Promise((resolve, reject) => {
      const chunks: Buffer[] = []
      ffprobe.stdout.on('data', (chunk) => {
        chunks.push(chunk)
      })
      ffprobe.stdout.on('end', () => {
        const data = JSON.parse(Buffer.concat(chunks).toString())
        const videoStream = data.streams.find((s: any) => s.codec_type === 'video')
        if (!videoStream) {
          return reject(new BadRequestError('Arquivo de vídeo inválido ou corrompido'))
        }
        const audioStream = data.streams.find((s: any) => s.codec_type === 'audio')
        resolve({
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
        })
      })
      ffprobe.stderr.on('data', (error) => {
        this.logger.error(`FFprobe error: ${error.toString()}`)
        reject(new InternalServerError('Erro ao ler informações do vídeo'))
      })
      stream.pipe(ffprobe.stdin)
    })
  }
}
