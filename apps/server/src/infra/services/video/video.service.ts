import type { IReadStream } from '@edu/framework'

export interface IVideoService {
  getInfo(input: GetInfoInput): Promise<GetVideoInfoOutput>
  createVariants(input: CreateVariantsInput): Promise<CreateVariantsOutput>
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

export type CreateVariantsInput = {
  buffer: Buffer
  maxResolution: number
}

export type CreateVariantsOutput = {
  files: ProcessorFile[]
  close: () => Promise<void>
}

export type CreateManifestInput = {
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
