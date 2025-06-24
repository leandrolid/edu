import { RESOLUTIONS } from '@domain/constants/resolutions'
import { BadRequestError, Injectable, InternalServerError, Logger } from '@edu/framework'
import { FfmpegBuilder } from '@infra/adapters/ffmpeg/ffmpeg.builder'
import { FfProbeBuilder } from '@infra/adapters/ffmpeg/ffprobe.builder'
import { TmpStorageAdapter } from '@infra/adapters/tmp-storage/tmp-storage.adapter'
import type {
  CreateManifestInput,
  CreateManifestOutput,
  GetInfoInput,
  GetVideoInfoOutput,
  IVideoService,
  ProcessFileInput,
  ProcessFileOutput,
} from '@infra/services/video/video.service'
import { createReadStream } from 'node:fs'
import { rm } from 'node:fs/promises'
import { join } from 'node:path'
import { Readable } from 'node:stream'

@Injectable({
  token: 'IVideoService',
})
export class VideoService implements IVideoService {
  private readonly logger = new Logger('FFmpeg')

  constructor(private readonly tmpStorage: TmpStorageAdapter) {}

  public async processFile(input: ProcessFileInput): Promise<ProcessFileOutput> {
    const tempDir = crypto.randomUUID()
    const ffmpeg = FfmpegBuilder.init(this.logger)
      .addAcceleration()
      .input('pipe:0')
      .to144p(input.maxResolution, join(process.cwd(), `node_modules/.temp/144p.webm`))
      .to240p(input.maxResolution, join(process.cwd(), `node_modules/.temp/240p.webm`))
      .to360p(input.maxResolution, join(process.cwd(), `node_modules/.temp/360p.webm`))
      .to480p(input.maxResolution, join(process.cwd(), `node_modules/.temp/480p.webm`))
      .to720p(input.maxResolution, join(process.cwd(), `node_modules/.temp/720p.webm`))
      .to1080p(input.maxResolution, join(process.cwd(), `node_modules/.temp/1080p.webm`))
      .toAudio(join(process.cwd(), `node_modules/.temp/audio.webm`))
      .build()
    return new Promise<ProcessFileOutput>((resolve, reject) => {
      const stream = Readable.from(input.buffer)
      stream.pipe(ffmpeg.stdin)
      ffmpeg.on('close', () => {
        const files = RESOLUTIONS.filter(
          (resolution) => resolution.height <= input.maxResolution,
        ).map((resolution) => {
          const filePath = join(process.cwd(), `node_modules/.temp/${resolution.label}.webm`)
          return {
            name: `${resolution.label}.${resolution.extension}`,
            toStream: () => createReadStream(filePath),
          }
        })
        return resolve({
          files,
          close: async () => {
            ffmpeg.stdin.destroy()
            ffmpeg.stdout.destroy()
            ffmpeg.kill()
            await Promise.all(
              files.map(async (file) => {
                const filePath = join(process.cwd(), `node_modules/.temp/${file.name}`)
                try {
                  await rm(filePath)
                } catch (error) {
                  this.logger.error(`Erro ao remover o arquivo temporário: ${filePath}`)
                }
              }),
            )
          },
        })
      })
      ffmpeg.on('error', (error) => {
        this.logger.error(error.message)
        reject(new InternalServerError('Erro ao processar o vídeo'))
      })
      ffmpeg.stdin.on('error', (error) => {
        this.logger.error(error.message)
        reject(new InternalServerError('Erro ao processar o vídeo'))
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

  public async createManifest({ files }: CreateManifestInput): Promise<CreateManifestOutput> {
    const outputPath = join(process.cwd(), `node_modules/.temp/manifest.mpd`)
    const ffmpeg = FfmpegBuilder.init(this.logger)
      .toManifest(
        files.map((file) => join(process.cwd(), `node_modules/.temp/${file.name}`)),
        outputPath,
      )
      .build()
    return new Promise<CreateManifestOutput>((resolve, reject) => {
      ffmpeg.on('close', () => {
        this.logger.info('Manifest generated successfully')
        resolve({
          file: {
            name: 'manifest.mpd',
            toStream: () => createReadStream(outputPath),
          },
          close: async () => {
            try {
              await rm(outputPath)
            } catch (error) {
              this.logger.error(`Erro ao remover o manifesto temporário: ${outputPath}`)
            }
          },
        })
      })
      ffmpeg.on('error', (error) => {
        this.logger.error(`FFmpeg error: ${error.message}`)
        reject(new InternalServerError('Erro ao gerar o manifesto do vídeo'))
      })
      ffmpeg.stdin.on('error', (error) => {
        this.logger.error(`FFmpeg stdin error: ${error.message}`)
        reject(new InternalServerError('Erro ao gerar o manifesto do vídeo'))
      })
    })
  }
}
