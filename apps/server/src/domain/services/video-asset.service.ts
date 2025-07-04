import type { Prettify } from '@edu/utils'

export interface IVideoAssetService {
  createPath(input: CreateAssetInput): string
  getResolutionPath(input: GetAssetIdInput): string
  getAllResolutionsPath(input: GetAllAssetsIdInput): string[]
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
