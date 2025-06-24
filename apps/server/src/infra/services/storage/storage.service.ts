import type { IReadStream } from '@edu/framework'

export interface IStorageService {
  uploadStream(input: UploadStreamInput): Promise<UploadStreamOutput>
  getOne(key: string): Promise<GetOneOutput>
  clear(): Promise<void>
}

export type UploadStreamInput = {
  key: string
  stream: IReadStream
}

export type UploadStreamOutput = {
  url: string
  key: string
  size: number
  toStream: () => IReadStream
}

export type GetOneOutput = {
  key: string
  url: string
  size: number
  mimetype: string
  toStream: (options?: { start: number; end: number }) => IReadStream
  toBuffer: () => Promise<Buffer>
}
