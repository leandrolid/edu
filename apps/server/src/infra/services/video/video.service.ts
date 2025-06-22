import type { IReadStream, IWriteStream } from '@edu/framework'

export interface IVideoService {
  getMp4Processor(): GetMp4ProcessorOutput
  getMp4Processors(input: GetMp4ProccessorsForResolutionsInput): GetMp4ProcessorOutput[]
  getInfo(input: IReadStream): Promise<GetVideoInfoOutput>
}

export type Resolution = '1080p' | '720p' | '480p' | '360p' | '240p' | '144p'

export type GetMp4ProcessorOutput = {
  resolution: Resolution | 'original'
  in: IWriteStream
  out: IReadStream
  kill: () => void
  onError: (error?: unknown) => void
}

export type GetMp4ProccessorsForResolutionsInput = {
  maxResolution: number
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
