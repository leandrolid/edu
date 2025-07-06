import type { Prettify } from '@edu/utils'

export interface IVideoAssetService {
  createPath(input: CreateAssetInput): string
  getResolutionPath(input: GetAssetIdInput): string
  getAllResolutionsPath(input: GetAllAssetsIdInput): string[]
  getInfo(input: GetInfoInput): Promise<GetVideoInfoOutput>
}

export type CreateAssetInput = {
  videoId: string
  slug: string
  name: string
}

export type GetAssetIdInput = {
  videoId: string
  slug: string
  resolution: '144p' | '240p' | '360p' | '480p' | '720p' | '1080p' | 'audio'
}

export type GetAllAssetsIdInput = Prettify<Omit<GetAssetIdInput, 'resolution'>>

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
