import type { StreamVideoInput } from '@app/materials/stream-video/stream-video.input'
import { BadRequestError, Injectable } from '@edu/framework'
import { Logger } from '@edu/framework/src/utils'
import { spawn } from 'node:child_process'
import { createReadStream, statSync } from 'node:fs'
import { resolve } from 'node:path'

@Injectable()
export class StreamVideoUseCase {
  private readonly logger = new Logger('FFmpeg')
  async execute({ range }: StreamVideoInput) {
    if (!range) {
      throw new BadRequestError('Range header is required for video streaming')
    }
    const filePath = resolve(__dirname, '../create-video/output.mp4')
    const videoSize = statSync(filePath).size
    const CHUNK_SIZE = 1 * 1024 * 1024
    const start = Number(range.replace(/\D/g, ''))
    const end = Math.min(start + CHUNK_SIZE, videoSize - 1)
    const videoStream = createReadStream(filePath, { start, end })
    return {
      videoStream,
      start,
      end,
      videoSize,
      contentLength: end - start + 1,
    }
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
