import { Injectable } from '@edu/framework'
import { FsStorageAdapter } from '@infra/adapters/fs-storage/fs-storage.adapter'
import type * as Storage from '@infra/services/storage/storage.service'
import { resolve } from 'node:path'

@Injectable({
  token: 'IStorageService',
})
export class StorageService implements Storage.IStorageService {
  private readonly storage: FsStorageAdapter
  constructor() {
    this.storage = new FsStorageAdapter(resolve(__dirname, '../../../../../../node_modules/.temp'))
  }

  async uploadStream({
    key,
    stream,
  }: Storage.UploadStreamInput): Promise<Storage.UploadStreamOutput> {
    const file = this.storage.saveToFile({
      fileName: key,
      inputStream: stream,
    })
    const result = await file.toPromise()
    return {
      url: result.pathName,
      key: result.fileName,
    }
  }

  async getOne(key: string): Promise<Storage.GetOneOutput> {
    const file = this.storage.getFile(key)
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
}
