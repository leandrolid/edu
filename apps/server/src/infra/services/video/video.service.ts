import type { IReadStream } from '@edu/framework'

export interface IVideoService {
  getMp4Processors(input: GetMp4ProccessorsForResolutionsInput): GetMp4ProcessorOutput[]
  getInfo(input: GetInfoInput): Promise<GetVideoInfoOutput>
}

export type Resolution = '1080p' | '720p' | '480p' | '360p' | '240p' | '144p'

export type GetMp4ProcessorOutput = {
  resolution: Resolution
  process(buffer: Buffer): void
  toStream: () => IReadStream
  kill: () => void
  onError: (error?: unknown) => void
}

export type GetMp4ProccessorsForResolutionsInput = {
  maxResolution: number
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
