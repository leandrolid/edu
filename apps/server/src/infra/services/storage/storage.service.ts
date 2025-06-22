import type { IReadStream } from '@edu/framework'

export interface IStorageService {
  uploadStream(input: UploadStreamInput): Promise<UploadStreamOutput>
  getOne(key: string): Promise<GetOneOutput>
}

export type UploadStreamInput = {
  key: string
  stream: IReadStream
}

export type UploadStreamOutput = {
  url: string
  key: string
}

export type GetOneOutput = {
  key: string
  url: string
  size: number
  toStream: (options?: { start: number; end: number }) => IReadStream
}
