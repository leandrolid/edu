import { Injectable } from '@edu/framework'
import { FsStorageAdapter } from '@infra/adapters/fs-storage/fs-storage.adapter'
import type {
  IStorageService,
  UploadStreamInput,
  UploadStreamOutput,
} from '@infra/services/storage/storage.service'
import { resolve as resolvePath } from 'node:path'

@Injectable({
  token: 'IStorageService',
})
export class StorageService implements IStorageService {
  private readonly storage: FsStorageAdapter
  constructor() {
    this.storage = new FsStorageAdapter(
      resolvePath(__dirname, '../../../../../../node_modules/.temp'),
    )
  }
  async uploadStream({ key, stream }: UploadStreamInput): Promise<UploadStreamOutput> {
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
}
