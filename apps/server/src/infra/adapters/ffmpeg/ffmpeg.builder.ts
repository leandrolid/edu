import type { Logger } from '@edu/framework'
import { spawn } from 'node:child_process'

export class FfmpegBuilder {
  static init(logger: Logger) {
    return new FfmpegBuilder([], logger)
  }

  private constructor(
    private readonly ffmpegArgs: string[],
    private readonly logger: Logger,
  ) {}

  addInput(input: string) {
    this.ffmpegArgs.push('-i', input)
    return this
  }

  addVideoCodec(codec: 'libx264' | 'h264' | 'vp9' | 'hevc') {
    this.ffmpegArgs.push('-vcodec', codec)
    return this
  }

  addAudioCodec(codec: 'aac' | 'mp3' | 'opus') {
    this.ffmpegArgs.push('-acodec', codec)
    return this
  }

  addMovFlags(flags: string) {
    this.ffmpegArgs.push('-movflags', flags)
    return this
  }

  addBitrate(bitrate: string) {
    this.ffmpegArgs.push('-b:v', bitrate)
    return this
  }

  addMaxRate(maxRate: string) {
    this.ffmpegArgs.push('-maxrate', maxRate)
    return this
  }

  addBufSize(bufSize: string) {
    this.ffmpegArgs.push('-bufsize', bufSize)
    return this
  }

  addFormat(format: 'mp4' | 'webm' | 'mkv') {
    this.ffmpegArgs.push('-f', format)
    return this
  }

  addOutput(output: string) {
    this.ffmpegArgs.push(output)
    return this
  }

  build() {
    const process = spawn('ffmpeg', this.ffmpegArgs, {
      stdio: 'pipe',
      detached: true,
      shell: true,
    })
    process.on('error', (err) => {
      process.stdin.destroy(err)
      process.stdout.destroy(err)
    })
    process.on('close', (code) => {
      if (code !== 0) {
        this.logger.error(`FFmpeg exited with code ${code}`)
      } else {
        this.logger.success('FFmpeg processing completed successfully')
      }
    })
    process.stderr.on('data', (error) => this.logger.error(error.toString()))
    process.stdout.on('data', (data) => this.logger.debug(data.toString()))
    process.stdout.on('error', (error) => {
      process.stdin.destroy(error)
      process.kill()
    })
    return process
  }
}
