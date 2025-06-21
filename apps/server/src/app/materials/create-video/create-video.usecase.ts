import type { CreateVideoInput } from '@app/materials/create-video/create-video.input'
import type { Auth } from '@domain/dtos/auth.dto'
import { Injectable } from '@edu/framework'
import { Logger } from '@edu/framework/src/utils'
import { spawn } from 'node:child_process'
import { createWriteStream, rmSync } from 'node:fs'
import { resolve } from 'node:path'

@Injectable()
export class CreateVideoUseCase {
  private readonly logger = new Logger('FFmpeg')

  async execute({ file }: Auth<CreateVideoInput>) {
    const inputStream = file.getFileStream()
    const outputStream = this.getOutputStream()
    const ffmpeg = this.getFFmpeg()
    inputStream.pipe(ffmpeg.stdin)
    ffmpeg.stdout.pipe(outputStream)
    ffmpeg.stderr.on('data', (data) => this.logger.info(data.toString()))
    ffmpeg.on('close', (code) => {
      if (code !== 0) {
        this.logger.error(`FFmpeg exited with code ${code}`)
        inputStream.destroy(new Error(`FFmpeg exited with code ${code}`))
      } else {
        this.logger.success('FFmpeg processing completed successfully')
        inputStream.destroy()
      }
      outputStream.end()
    })
    return { message: 'Secesso!' }
  }

  private getOutputStream() {
    const filePath = resolve(__dirname, 'output.mp4')
    rmSync(filePath, { force: true })
    return createWriteStream(resolve(__dirname, 'output.mp4'))
  }

  private getFFmpeg() {
    return spawn(
      'ffmpeg',
      [
        '-i',
        'pipe:0',
        '-vcodec',
        'libx264',
        '-acodec',
        'aac',
        '-movflags',
        'frag_keyframe+empty_moov+default_base_moof',
        '-b:v',
        '1500k',
        '-maxrate',
        '1500k',
        '-bufsize',
        '1000k',
        '-f',
        'mp4',
        'pipe:1',
      ],
      { stdio: 'pipe', detached: true, shell: true },
    )
  }
}
