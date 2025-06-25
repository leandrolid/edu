import { Injectable, InternalServerError, type IReadStream } from '@edu/framework'
import { createWriteStream } from 'node:fs'
import { dirSync, fileSync } from 'tmp'

@Injectable()
export class TmpStorageAdapter {
  async streamToTempFile({
    name,
    dir,
    stream,
    extension,
  }: {
    name?: string
    dir?: string
    stream: IReadStream
    extension: 'webm' | 'mpd'
  }): Promise<{
    name: string
    close: () => void
  }> {
    return new Promise((resolve, reject) => {
      const tmpFile = fileSync({
        name,
        dir,
        postfix: `.${extension}`,
        keep: true,
      })
      const writeStream = createWriteStream(tmpFile.name)
      stream.pipe(writeStream)
      writeStream.on('finish', () =>
        resolve({
          name: tmpFile.name,
          close: () => tmpFile.removeCallback(),
        }),
      )
      writeStream.on('error', reject)
    })
  }

  async createTempDir(): Promise<{
    name: string
    close: () => void
  }> {
    return new Promise((resolve, reject) => {
      const tmpDir = dirSync({ keep: true, unsafeCleanup: true })
      if (tmpDir.name) {
        resolve({
          name: tmpDir.name,
          close: () => tmpDir.removeCallback(),
        })
      } else {
        reject(new InternalServerError('Failed to create temporary directory'))
      }
    })
  }
}
