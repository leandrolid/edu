import type { IReadStream } from '@edu/framework'

export interface IStorageService {
  uploadOne(input: UploadOneInput): Promise<UploadOneOutput>
  uploadStream(input: UploadStreamInput): Promise<UploadStreamOutput>
  getOne(key: string): Promise<GetOneOutput>
  getMany(keys: string[]): Promise<GetOneOutput[]>
  clear(): Promise<void>
  deleteDirectory(directory: string): Promise<void>
}

export type UploadOneInput = {
  key: string
  buffer: Buffer
}

export type UploadOneOutput = {
  url: string
  key: string
  size: number
  toStream: () => IReadStream
  toBuffer: () => Promise<Buffer>
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
