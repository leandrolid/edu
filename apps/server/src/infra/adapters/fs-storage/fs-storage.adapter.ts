import { NotFoundError, type IReadStream } from '@edu/framework'
import {
  createReadStream,
  createWriteStream,
  existsSync,
  mkdirSync,
  rmSync,
  statSync,
  writeFileSync,
} from 'node:fs'
import { join, resolve as resolvePath } from 'node:path'

export class FsStorageAdapter {
  constructor(private readonly baseDir: string) {
    if (!existsSync(baseDir)) {
      mkdirSync(baseDir, { recursive: true })
    }
    const tempFilePath = join(baseDir, 'tempfile.txt')
    writeFileSync(tempFilePath, 'Temporary file created for testing.')
  }

  public saveToFile({ fileName, inputStream }: { fileName: string; inputStream: IReadStream }) {
    const filePath = join(this.baseDir, fileName)
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

  public getFile(fileName: string) {
    const filePath = join(this.baseDir, fileName)
    if (!existsSync(filePath)) {
      throw new NotFoundError(`Arquivo não encontrado: ${fileName}`)
    }
    const stats = statSync(filePath)
    return {
      fileName,
      pathName: `file://${resolvePath(filePath)}`,
      fileSize: stats.size,
      toStream: (options?: { start: number; end: number }) => {
        return createReadStream(filePath, options)
      },
    }
  }
}
