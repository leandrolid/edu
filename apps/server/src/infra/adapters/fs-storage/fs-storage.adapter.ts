import { type IReadStream } from '@edu/framework'
import { createWriteStream, existsSync, mkdirSync, rmSync, writeFileSync } from 'node:fs'
import { join, resolve as resolvePath } from 'node:path'

export class FsStorageAdapter {
  constructor(private readonly tempDir: string) {
    if (!existsSync(tempDir)) {
      mkdirSync(tempDir, { recursive: true })
    }
    const tempFilePath = join(tempDir, 'tempfile.txt')
    writeFileSync(tempFilePath, 'Temporary file created for testing.')
  }

  public saveToFile({ fileName, inputStream }: { fileName: string; inputStream: IReadStream }) {
    const filePath = join(this.tempDir, fileName)
    rmSync(filePath, { force: true })
    const outputStream = createWriteStream(filePath, { flags: 'w' })
    inputStream.pipe(outputStream)
    return {
      outputStream,
      toPromise: () => {
        return new Promise<{
          pathName: string
          fileName: string
        }>((resolve, reject) => {
          outputStream.on('finish', () => {
            resolve({
              pathName: `file://${resolvePath(filePath)}`,
              fileName,
            })
          })
          outputStream.on('error', (error) => {
            reject(error)
          })
        })
      },
    }
  }
}
