import { Injectable, NotFoundError, type IReadStream } from '@edu/framework'
import {
  createReadStream,
  createWriteStream,
  existsSync,
  mkdirSync,
  rmSync,
  statSync,
  writeFileSync,
} from 'node:fs'
import { readFile } from 'node:fs/promises'
import { join, resolve as resolvePath } from 'node:path'

@Injectable()
export class FsStorageAdapter {
  private baseDir: string = '/tmp/fs-storage'

  constructor() {}

  public init(baseDir: string) {
    this.baseDir = baseDir
    if (!existsSync(baseDir)) {
      mkdirSync(baseDir, { recursive: true })
    }
    const tempFilePath = join(baseDir, 'tempfile.txt')
    writeFileSync(tempFilePath, 'Temporary file created for testing.')
  }

  public saveToFile({ fileName, inputStream }: { fileName: string; inputStream: IReadStream }) {
    const filePath = join(this.baseDir, fileName)
    rmSync(filePath, { force: true })
    const fileDir = filePath.split('/').slice(0, -1).join('/')
    if (!existsSync(fileDir)) {
      mkdirSync(fileDir, { recursive: true })
    }
    const outputStream = createWriteStream(filePath)
    inputStream.pipe(outputStream)
    return {
      outputStream,
      toPromise: () => {
        return new Promise<{
          pathName: string
          fileName: string
          toStream: () => IReadStream
          fileSize: number
        }>((resolve, reject) => {
          outputStream.on('finish', () => {
            resolve({
              pathName: `file://${resolvePath(filePath)}`,
              fileName,
              fileSize: statSync(filePath).size,
              toStream: () => createReadStream(filePath),
            })
          })
          outputStream.on('error', (error) => reject(error))
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
      mimeType: this.getMimeType(fileName),
      toStream: (options?: { start: number; end: number }) => {
        return createReadStream(filePath, options)
      },
      toBuffer: () => {
        return readFile(filePath)
      },
    }
  }

  async clear() {
    if (!existsSync(this.baseDir)) return
    rmSync(this.baseDir, { recursive: true, force: true })
    mkdirSync(this.baseDir, { recursive: true })
  }

  private getMimeType(fileName: string): string {
    const ext = fileName.split('.').pop()?.toLowerCase()
    switch (ext) {
      case 'mp4':
        return 'video/mp4'
      case 'webm':
        return 'video/webm'
      case 'mpd':
        return 'application/dash+xml'
      default:
        return 'application/octet-stream'
    }
  }
}
