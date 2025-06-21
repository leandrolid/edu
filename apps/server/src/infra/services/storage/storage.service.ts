import type { IReadStream } from '@edu/framework'

export interface IStorageService {
  uploadStream(input: UploadStreamInput): Promise<UploadStreamOutput>
}

export type UploadStreamInput = {
  key: string
  stream: IReadStream
}

export type UploadStreamOutput = {
  url: string
  key: string
}
