import { Injectable, InternalServerError } from '@edu/framework'
import { FsStorageAdapter } from '@infra/adapters/fs-storage/fs-storage.adapter'
import type * as Storage from '@infra/services/storage/storage.service'
import { resolve } from 'node:path'

@Injectable({
  token: 'IStorageService',
})
export class StorageService implements Storage.IStorageService {
  constructor(private readonly fsStorage: FsStorageAdapter) {
    this.fsStorage.init(resolve(process.cwd(), './node_modules/.temp'))
  }

  async uploadOne({ key, buffer }: Storage.UploadOneInput): Promise<Storage.UploadOneOutput> {
    try {
      const file = this.fsStorage.saveBuffer({
        fileName: key,
        buffer,
      })
      return {
        url: file.pathName,
        key: file.fileName,
        size: file.fileSize,
        toStream: () => file.toStream(),
        toBuffer: () => file.toBuffer(),
      }
    } catch (error) {
      console.error(error)
      throw new InternalServerError('Erro ao fazer upload do arquivo')
    }
  }

  async uploadStream({
    key,
    stream,
  }: Storage.UploadStreamInput): Promise<Storage.UploadStreamOutput> {
    try {
      const file = this.fsStorage.saveStream({
        fileName: key,
        inputStream: stream,
      })
      const result = await file.toPromise()
      return {
        url: result.pathName,
        key: result.fileName,
        size: result.fileSize,
        toStream: () => result.toStream(),
      }
    } catch (error) {
      console.error(error)
      throw new InternalServerError('Erro ao fazer upload do arquivo')
    }
  }

  async getOne(key: string): Promise<Storage.GetOneOutput> {
    const file = this.fsStorage.getFile(key)
    return {
      key: file.fileName,
      url: file.pathName,
      size: file.fileSize,
      mimetype: file.mimeType,
      toStream: (options) => {
        return file.toStream(options)
      },
      toBuffer: () => {
        return file.toBuffer()
      },
    }
  }

  async getMany(keys: string[]): Promise<Storage.GetOneOutput[]> {
    const files = await Promise.all(keys.map((key) => this.getOne(key)))
    return files
  }

  async clear(): Promise<void> {
    this.fsStorage.clear()
  }

  async deleteDirectory(directory: string): Promise<void> {
    try {
      this.fsStorage.deleteDirectory(directory)
    } catch (error) {
      console.error(error)
      throw new InternalServerError('Erro ao deletar o diretório')
    }
  }

  async existMany(fileNames: string[]): Promise<boolean> {
    try {
      return this.fsStorage.filesExist(fileNames)
    } catch (error) {
      console.error(error)
      throw new InternalServerError('Erro ao verificar a existência dos arquivos')
    }
  }
}
