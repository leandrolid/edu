import { type Logger } from '@edu/framework'
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
    process.stderr.on('data', (error) => this.logger.info(error.toString()))
    return {
      input: process.stdin,
      output: process.stdout,
      toPromise: () => {
        return new Promise<any>((resolve, reject) => {
          const chunks: Buffer[] = []
          process.stdout.on('data', (chunk) => {
            chunks.push(chunk)
          })
          process.stdout.on('end', () => {
            const data = JSON.parse(Buffer.concat(chunks).toString())
            resolve(data)
          })
          process.on('error', (error) => {
            this.logger.error(`FFmpeg error: ${error.message}`)
            reject(error)
          })
          process.stdout.on('error', (error) => {
            process.stdin.destroy(error)
            process.stdout.destroy(error)
            process.kill(1)
            reject(error)
          })
        })
      },
    }
  }
}
