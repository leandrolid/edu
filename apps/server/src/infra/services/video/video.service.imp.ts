import { BadRequestError, Injectable, InternalServerError, Logger } from '@edu/framework'
import { FfmpegBuilder } from '@infra/adapters/ffmpeg/ffmpeg.builder'
import { FfProbeBuilder } from '@infra/adapters/ffmpeg/ffprobe.builder'
import type {
  GetInfoInput,
  GetMp4ProccessorsForResolutionsInput,
  GetMp4ProcessorOutput,
  GetVideoInfoOutput,
  IVideoService,
  Resolution,
} from '@infra/services/video/video.service'
import { Readable } from 'node:stream'

const RESOLUTIONS = [
  { label: '1080p', height: 1080, bitrate: '5000k', extension: 'webm' },
  { label: '720p', height: 720, bitrate: '3000k', extension: 'webm' },
  // { label: '480p', height: 480, bitrate: '1500k', extension: 'webm' },
  // { label: '360p', height: 360, bitrate: '800k', extension: 'webm' },
  // { label: '240p', height: 240, bitrate: '500k', extension: 'webm' },
  { label: '144p', height: 144, bitrate: '200k', extension: 'webm' },
  { label: 'audio', height: 0, bitrate: '128k', extension: 'webm' },
]

@Injectable({
  token: 'IVideoService',
})
export class VideoService implements IVideoService {
  private readonly logger = new Logger('FFmpeg')

  public getMp4Processors(input: GetMp4ProccessorsForResolutionsInput): GetMp4ProcessorOutput[] {
    return RESOLUTIONS.filter((resolution) => resolution.height <= input.maxResolution).map(
      (resolution) => {
        const ffmpeg =
          resolution.height > 0
            ? FfmpegBuilder.init(this.logger)
                .addInput('pipe:0')
                .addVideoCodec('libvpx-vp9')
                .addMinKeyframe(150)
                .addGopSize(150)
                .addTileColumns(4)
                .addFrameParallel(1)
                .addFormat('webm')
                .addDash(1)
                .addAudioDisable()
                .addVideoFilter(`"scale=-2:min(${resolution.height}\\,ih)"`)
                .addBitrate(resolution.bitrate)
                .addMaxRate(resolution.bitrate)
                .addDash(1)
                .addOutput('pipe:1')
                .build()
            : FfmpegBuilder.init(this.logger)
                .addInput('pipe:0')
                .addAudioCodec('libvorbis')
                .addAudioBitrate(resolution.bitrate)
                .addDash(1)
                .addOutput('pipe:1')
                .build()
        return {
          resolution: resolution.label as Resolution,
          extension: resolution.extension,
          process: (buffer: Buffer) => {
            const stream = Readable.from(buffer)
            stream.pipe(ffmpeg.stdin)
          },
          toStream: () => ffmpeg.stdout,
          onError: (error?: unknown) => {
            ffmpeg.stdout.destroy(error as Error)
            ffmpeg.stdin.destroy(error as Error)
            ffmpeg.kill()
          },
        }
      },
    )
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
