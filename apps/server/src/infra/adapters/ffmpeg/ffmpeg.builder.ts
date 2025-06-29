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

  addAcceleration() {
    this.ffmpegArgs.push('-hwaccel auto')
    return this
  }

  input(input: string) {
    this.ffmpegArgs.push(`-i ${input}`)
    return this
  }

  toDash() {
    this.ffmpegArgs.push(
      '-c:v libvpx-vp9 -movflags frag_keyframe+empty_moov+default_base_moof -keyint_min 150 -g 150 -tile-columns 4 -frame-parallel 1 -f webm -dash 1',
    )
    return this
  }

  to144p(maxResolution: number, output: string) {
    if (maxResolution < 144) return this
    this.ffmpegArgs.push(`-an -vf scale=256:144 -b:v 250k -dash 1 ${output}`)
    return this
  }

  to240p(maxResolution: number, output: string) {
    if (maxResolution < 240) return this
    this.ffmpegArgs.push(`-an -vf scale=426:240 -b:v 500k -dash 1 ${output}`)
    return this
  }

  to360p(maxResolution: number, output: string) {
    if (maxResolution < 360) return this
    this.ffmpegArgs.push(`-an -vf scale=640:360 -b:v 800k -dash 1 ${output}`)
    return this
  }

  to480p(maxResolution: number, output: string) {
    if (maxResolution < 480) return this
    this.ffmpegArgs.push(`-an -vf scale=854:480 -b:v 1500k -dash 1 ${output}`)
    return this
  }

  to720p(maxResolution: number, output: string) {
    if (maxResolution < 720) return this
    this.ffmpegArgs.push(`-an -vf scale=1280:720 -b:v 3000k -dash 1 ${output}`)
    return this
  }

  to1080p(maxResolution: number, output: string) {
    if (maxResolution < 1080) return this
    this.ffmpegArgs.push(`-an -vf scale=1920:1080 -b:v 5000k -dash 1 ${output}`)
    return this
  }

  toAudio(output: string) {
    this.ffmpegArgs.push(`-vn -acodec libvorbis -ab 128k -dash 1 ${output}`)
    return this
  }

  toManifest(files: string[], output: string) {
    files.forEach((file) => {
      this.ffmpegArgs.push(`-f webm_dash_manifest -i ${file}`)
    })
    this.ffmpegArgs.push(
      '-c copy',
      files.map((_, index) => `-map ${index}`).join(' '),
      '-f webm_dash_manifest',
      `-adaptation_sets "id=0,streams=${files
        .slice(0, -1)
        .map((_, index) => index)
        .join(',')} id=1,streams=${files.length - 1}"`,
      output,
      '-y',
    )
    return this
  }

  toThumbnail(output: string) {
    this.ffmpegArgs.push(`-ss 00:00:01.000 -vframes 1 ${output}`)
    return this
  }

  build() {
    this.logger.warn(`ffmpeg ${this.ffmpegArgs.join(' ')}`)
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
    process.stderr.on('data', (error) => this.logger.info(error.toString()))
    process.stdout.on('data', (data) => this.logger.debug(data.toString()))
    process.stdout.on('error', (error) => {
      process.stdin.destroy(error)
      process.stdout.destroy(error)
      process.kill()
    })
    process.stdout.on('end', () => {
      process.stdin.destroy()
      process.stdout.destroy()
      process.kill()
    })
    return process
  }
}
