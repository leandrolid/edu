import type { IReadStream } from '@edu/framework'

export interface IVideoService {
  getInfo(input: GetInfoInput): Promise<GetVideoInfoOutput>
  processFile(input: ProcessFileInput): Promise<ProcessFileOutput>
  createManifest(input: CreateManifestInput): Promise<CreateManifestOutput>
}

export type GetInfoInput = {
  buffer: Buffer
}

export type GetVideoInfoOutput = {
  format: {
    filename: string
    duration: number
    size: number
    bitrate: number
  }
  video: {
    width: number
    height: number
    codecName: string
    codecType: string
    bitRate: number
    duration: number
  }
  audio: {
    codecName: string
    codecType: string
    bitRate: number
    duration: number
  } | null
}

export type ProcessFileInput = {
  buffer: Buffer
  maxResolution: number
}

export type ProcessFileOutput = {
  files: ProcessorFile[]
  close: () => Promise<void>
}

export type CreateManifestInput = {
  maxResolution: number
  files: ProcessorFile[]
}

export type CreateManifestOutput = {
  file: ProcessorFile
  close: () => Promise<void>
}

type ProcessorFile = {
  name: string
  toStream: () => IReadStream
}

export type Resolution = '1080p' | '720p' | '480p' | '360p' | '240p' | '144p'
