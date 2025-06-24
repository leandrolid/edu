import { Injectable, type IReadStream } from '@edu/framework'
import { createWriteStream } from 'node:fs'
import { fileSync } from 'tmp'

@Injectable()
export class TmpStorageAdapter {
  async streamToTempFile(stream: IReadStream, extension: 'webm') {
    return new Promise<{
      path: string
      dispose: () => void
    }>((resolve, reject) => {
      const tmpFile = fileSync({ postfix: `.${extension}`, keep: true })
      const writeStream = createWriteStream(tmpFile.name)
      stream.pipe(writeStream)
      writeStream.on('finish', () =>
        resolve({
          path: tmpFile.name,
          dispose: () => tmpFile.removeCallback(),
        }),
      )
      writeStream.on('error', reject)
    })
  }
}
