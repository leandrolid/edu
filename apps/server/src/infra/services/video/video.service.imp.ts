import { RESOLUTIONS } from '@domain/constants/resolutions'
import {
  BadRequestError,
  ConflictError,
  Injectable,
  InternalServerError,
  Logger,
} from '@edu/framework'
import { FfmpegBuilder } from '@infra/adapters/ffmpeg/ffmpeg.builder'
import { FfProbeBuilder } from '@infra/adapters/ffmpeg/ffprobe.builder'
import { TmpStorageAdapter } from '@infra/adapters/tmp-storage/tmp-storage.adapter'
import type {
  GenerateManifestInput,
  GetInfoInput,
  GetMp4ProccessorsForResolutionsInput,
  GetMp4ProcessorOutput,
  GetVideoInfoOutput,
  IVideoService,
  Resolution,
} from '@infra/services/video/video.service'
import { Readable } from 'node:stream'

@Injectable({
  token: 'IVideoService',
})
export class VideoService implements IVideoService {
  private readonly logger = new Logger('FFmpeg')

  constructor(private readonly tmpStorage: TmpStorageAdapter) {}

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
                // .addVideoFilter(`"scale=-2:min(${resolution.height}\\,ih)"`)
                .addVideoFilter(`scale=${resolution.width}:${resolution.height}`)
                .addBitrate(resolution.bitrate)
                .addMaxRate(resolution.bitrate)
                .addDash(1)
                .addOutput('pipe:1')
                .build()
            : FfmpegBuilder.init(this.logger)
                .addInput('pipe:0')
                .addVideoDisable()
                .addAudioCodec('libvorbis')
                .addAudioBitrate(resolution.bitrate)
                .addFormat('webm')
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

  public async generateManifest(input: GenerateManifestInput): Promise<string> {
    const streams = input.files.map((file) => {
      if (Buffer.isBuffer(file)) return Readable.from(file)
      if (Readable.isReadable(file)) return file
      throw new BadRequestError('Vídeos devem ser Buffer ou Readable Stream')
    })
    const files = await Promise.all(
      streams.map((stream) => this.tmpStorage.streamToTempFile(stream, 'webm')),
    )
    const builder = FfmpegBuilder.init(this.logger)
    files.forEach((file) => {
      builder.addFormat('webm_dash_manifest').addInput(file.path)
    })
    builder.addCodec('copy')
    files.forEach((_, index) => {
      builder.addMap(index)
    })
    const ffmpeg = builder
      .addFormat('webm_dash_manifest')
      .addAdaptationSets(`"id=0,streams=0,1 id=1,streams=2"`)
      .addOutput('pipe:1')
      .build()
    return new Promise((resolve, reject) => {
      const chunks: Buffer[] = []
      ffmpeg.stdout.on('data', (chunk) => {
        chunks.push(chunk)
      })
      ffmpeg.stdout.on('end', () => {
        ffmpeg.stdout.destroy()
        files.forEach((file) => file.dispose())
        resolve(Buffer.concat(chunks).toString())
      })
      ffmpeg.on('error', () => {
        files.forEach((file) => file.dispose())
        reject(new ConflictError('Erro ao gerar o manifesto do vídeo'))
      })
    })
  }
}
