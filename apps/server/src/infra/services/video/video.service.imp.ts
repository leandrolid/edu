// import { RESOLUTIONS } from '@domain/constants/resolutions'
// import { BadRequestError, Injectable, InternalServerError, Logger } from '@edu/framework'
// import { FfmpegBuilder } from '@infra/adapters/ffmpeg/ffmpeg.builder'
// import { FfProbeBuilder } from '@infra/adapters/ffmpeg/ffprobe.builder'
// import { TmpStorageAdapter } from '@infra/adapters/tmp-storage/tmp-storage.adapter'
// import type {
//   CreateManifestInput,
//   CreateManifestOutput,
//   CreateThumbnailInput,
//   CreateThumbnailOutput,
//   CreateVariantsInput,
//   CreateVariantsOutput,
//   GetInfoInput,
//   GetVideoInfoOutput,
//   IVideoService,
// } from '@infra/services/video/video.service'
// import { createReadStream } from 'node:fs'
// import { join } from 'node:path'
// import { Readable } from 'node:stream'

// @Injectable({
//   token: 'IVideoService',
// })
// export class VideoService implements IVideoService {
//   private readonly logger = new Logger('FFmpeg')
//   constructor(private readonly tmpStorage: TmpStorageAdapter) {}

//   public async getInfo(input: GetInfoInput): Promise<GetVideoInfoOutput> {
//     const stream = Readable.from(input.buffer)
//     const ffprobe = FfProbeBuilder.init(this.logger)
//       .addLogLevel('error')
//       .addPrintFormat('json')
//       .addShowFormat()
//       .addShowStreams()
//       .addInput('pipe:0')
//       .build()
//     return new Promise((resolve, reject) => {
//       const chunks: Buffer[] = []
//       ffprobe.stdout.on('data', (chunk) => {
//         chunks.push(chunk)
//       })
//       ffprobe.stdout.on('end', () => {
//         const data = JSON.parse(Buffer.concat(chunks).toString())
//         const videoStream = data.streams.find((stream: any) => stream.codec_type === 'video')
//         if (!videoStream) {
//           return reject(new BadRequestError('Arquivo de vídeo inválido ou corrompido'))
//         }
//         const audioStream = data.streams.find((stream: any) => stream.codec_type === 'audio')
//         resolve({
//           format: {
//             filename: data.format.filename,
//             duration: parseFloat(data.format.duration),
//             size: data.format.size ? parseInt(data.format.size, 10) : 0,
//             bitrate: data.format.bit_rate ? parseInt(data.format.bit_rate, 10) : 0,
//           },
//           video: {
//             width: videoStream.width,
//             height: videoStream.height,
//             codecName: videoStream.codec_name,
//             codecType: videoStream.codec_type,
//             bitRate: parseInt(videoStream.bit_rate, 10),
//             duration: parseFloat(videoStream.duration),
//           },
//           audio: audioStream
//             ? {
//                 codecName: audioStream.codec_name,
//                 codecType: audioStream.codec_type,
//                 bitRate: parseInt(audioStream.bit_rate, 10),
//                 duration: parseFloat(audioStream.duration),
//               }
//             : null,
//         })
//       })
//       ffprobe.stdio.forEach((std) => {
//         std?.on('error', () => reject(new InternalServerError('Erro ao ler informação do vídeo')))
//       })
//       ffprobe.stderr.on('data', () => {
//         reject(new InternalServerError('Erro ao ler informação do vídeo'))
//       })
//       stream.pipe(ffprobe.stdin)
//     })
//   }

//   public async createVariants(input: CreateVariantsInput): Promise<CreateVariantsOutput> {
//     const tempDir = await this.tmpStorage.createTempDir()
//     const ffmpeg = FfmpegBuilder.init(this.logger)
//       .addAcceleration()
//       .input('pipe:0')
//       .toDash()
//       .to144p(input.maxResolution, join(tempDir.name, '144p.webm'))
//       .to240p(input.maxResolution, join(tempDir.name, '240p.webm'))
//       .to360p(input.maxResolution, join(tempDir.name, '360p.webm'))
//       .to480p(input.maxResolution, join(tempDir.name, '480p.webm'))
//       .to720p(input.maxResolution, join(tempDir.name, '720p.webm'))
//       .to1080p(input.maxResolution, join(tempDir.name, '1080p.webm'))
//       .toAudio(join(tempDir.name, 'audio.webm'))
//       .build()
//     return new Promise<CreateVariantsOutput>((resolve, reject) => {
//       const stream = Readable.from(input.buffer)
//       stream.pipe(ffmpeg.stdin)
//       ffmpeg.on('close', () => {
//         return resolve({
//           files: RESOLUTIONS.filter((resolution) => resolution.height <= input.maxResolution).map(
//             (resolution) => {
//               return {
//                 name: `${resolution.label}.${resolution.extension}`,
//                 toStream: () => {
//                   return createReadStream(
//                     join(tempDir.name, `${resolution.label}.${resolution.extension}`),
//                   )
//                 },
//               }
//             },
//           ),
//           close: async () => {
//             ffmpeg.stdin.destroy()
//             ffmpeg.stdout.destroy()
//             ffmpeg.kill()
//             tempDir.close()
//           },
//         })
//       })
//       ffmpeg.on('error', (error) => {
//         this.logger.error(error.message)
//         ffmpeg.stdin.destroy()
//         ffmpeg.stdout.destroy()
//         ffmpeg.kill()
//         reject(new InternalServerError('Erro ao processar vídeo'))
//       })
//       ffmpeg.stdin.on('error', (error) => {
//         this.logger.error(error.message)
//         ffmpeg.stdin.destroy()
//         ffmpeg.stdout.destroy()
//         ffmpeg.kill()
//         reject(new InternalServerError('Erro ao processar vídeo'))
//       })
//     })
//   }

//   public async createManifest({ files }: CreateManifestInput): Promise<CreateManifestOutput> {
//     const tempDir = await this.tmpStorage.createTempDir()
//     const tempFiles = await Promise.all(
//       files.map((file) =>
//         this.tmpStorage.streamToTempFile({
//           name: file.name,
//           dir: tempDir.name.split('/').pop(),
//           stream: file.toStream(),
//           extension: 'webm',
//         }),
//       ),
//     )
//     const ffmpeg = FfmpegBuilder.init(this.logger)
//       .toManifest(
//         tempFiles.map((file) => file.name),
//         join(tempDir.name, 'manifest.mpd'),
//       )
//       .build()
//     return new Promise<CreateManifestOutput>((resolve, reject) => {
//       ffmpeg.on('close', (code) => {
//         if (code !== 0) {
//           this.logger.error(`FFmpeg exited with code ${code}`)
//           return reject(new InternalServerError('Erro ao gerar o manifesto do vídeo'))
//         }
//         resolve({
//           file: {
//             name: 'manifest.mpd',
//             toStream: () => createReadStream(join(tempDir.name, 'manifest.mpd')),
//           },
//           close: async () => {
//             tempFiles.forEach((file) => file.close())
//             tempDir.close()
//             ffmpeg.kill()
//           },
//         })
//       })
//       ffmpeg.on('error', (error) => {
//         tempFiles.forEach((file) => file.close())
//         tempDir.close()
//         reject(error)
//       })
//       ffmpeg.stdio.forEach((std) => {
//         std?.on('error', (error) => {
//           tempFiles.forEach((file) => file.close())
//           tempDir.close()
//           reject(error)
//         })
//       })
//     })
//   }

//   async createThumbnail(input: CreateThumbnailInput): Promise<CreateThumbnailOutput> {
//     const tempDir = await this.tmpStorage.createTempDir()
//     const ffmpeg = FfmpegBuilder.init(this.logger)
//       .input('pipe:0')
//       .toThumbnail(join(tempDir.name, 'thumbnail.jpg'))
//       .build()
//     return new Promise<CreateThumbnailOutput>((resolve, reject) => {
//       const stream = Readable.from(input.buffer)
//       stream.pipe(ffmpeg.stdin)
//       ffmpeg.on('close', () => {
//         resolve({
//           file: {
//             name: 'thumbnail.jpg',
//             toStream: () => createReadStream(join(tempDir.name, 'thumbnail.jpg')),
//           },
//           close: async () => {
//             ffmpeg.stdin.destroy()
//             ffmpeg.stdout.destroy()
//             ffmpeg.kill()
//             tempDir.close()
//           },
//         })
//       })
//       ffmpeg.on('error', (error) => {
//         this.logger.error(error.message)
//         ffmpeg.stdin.destroy()
//         ffmpeg.stdout.destroy()
//         ffmpeg.kill()
//         reject(new InternalServerError('Erro ao processar vídeo'))
//       })
//     })
//   }
// }
