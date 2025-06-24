import type { Logger } from '@edu/framework'
import { exec, spawn } from 'node:child_process'

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

  addAccel(accel: 'cuda' | 'vaapi' | 'vdpau' | 'qsv') {
    this.ffmpegArgs.push('-hwaccel', accel)
    return this
  }

  addVideoCodec(codec: 'libx264' | 'h264' | 'vp9' | 'hevc' | 'libvpx-vp9') {
    this.ffmpegArgs.push('-c:v', codec)
    return this
  }

  addAudioCodec(codec: 'aac' | 'mp3' | 'opus' | 'libvorbis') {
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

  addVideoFilter(filter: string) {
    this.ffmpegArgs.push('-vf', filter)
    return this
  }

  addFormat(format: 'mp4' | 'webm' | 'mkv' | 'webm_dash_manifest') {
    this.ffmpegArgs.push('-f', format)
    return this
  }

  addOutput(output: string) {
    this.ffmpegArgs.push(output)
    return this
  }

  addMinKeyframe(minKeyframe: number) {
    this.ffmpegArgs.push('-keyint_min', minKeyframe.toString())
    return this
  }

  addGopSize(gopSize: number) {
    this.ffmpegArgs.push('-g', gopSize.toString())
    return this
  }

  addTileColumns(tileColumns: number) {
    this.ffmpegArgs.push('-tile-columns', tileColumns.toString())
    return this
  }

  addFrameParallel(frameParallel: number) {
    this.ffmpegArgs.push('-frame-parallel', frameParallel.toString())
    return this
  }

  addDash(dash: number) {
    this.ffmpegArgs.push('-dash', dash.toString())
    return this
  }

  addAudioDisable() {
    this.ffmpegArgs.push('-an')
    return this
  }

  addAudioBitrate(bitrate: string) {
    this.ffmpegArgs.push('-ab', bitrate)
    return this
  }

  addVideoDisable() {
    this.ffmpegArgs.push('-vn')
    return this
  }

  addCodec(codec: 'copy' | 'libx264' | 'h264' | 'vp9' | 'hevc' | 'libvpx-vp9') {
    this.ffmpegArgs.push('-c', codec)
    return this
  }

  addMap(map: number) {
    this.ffmpegArgs.push('-map', map.toString())
    return this
  }

  addAdaptationSets(adaptationSets: string) {
    this.ffmpegArgs.push('-adaptation_sets', adaptationSets)
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

  exec() {
    this.logger.warn(`ffmpeg ${this.ffmpegArgs.join(' ')}`)
    const process = exec(`ffmpeg ${this.ffmpegArgs.join(' ')}`, (error, stdout, stderr) => {
      if (error) {
        return this.logger.error(error.message)
      }
      if (stderr) {
        return this.logger.error(stderr)
      }
      this.logger.info(stdout)
    })
    return process
  }
}
