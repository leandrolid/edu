import type { Logger } from '@edu/framework'
import { spawn } from 'node:child_process'

export class FfProbeBuilder {
  static init(logger: Logger) {
    return new FfProbeBuilder([], logger)
  }

  private constructor(
    private readonly ffmpegArgs: string[],
    private readonly logger: Logger,
  ) {}

  addInput(input: string) {
    this.ffmpegArgs.push(input)
    return this
  }

  addLogLevel(
    level:
      | 'quiet'
      | 'panic'
      | 'fatal'
      | 'error'
      | 'warning'
      | 'info'
      | 'verbose'
      | 'debug'
      | 'trace',
  ) {
    this.ffmpegArgs.push('-loglevel', level)
    return this
  }

  addPrintFormat(format: 'json' | 'xml' | 'flat') {
    this.ffmpegArgs.push('-print_format', format)
    return this
  }

  addShowFormat() {
    this.ffmpegArgs.push('-show_format')
    return this
  }

  addShowStreams() {
    this.ffmpegArgs.push('-show_streams')
    return this
  }

  build() {
    const process = spawn('ffprobe', this.ffmpegArgs, {
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
        this.logger.error(`FFprobe exited with code ${code}`)
      } else {
        this.logger.success('FFprobe processing completed successfully')
      }
    })
    process.stderr.on('data', (error) => this.logger.error(error.toString()))
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
