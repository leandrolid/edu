import type { Prettify } from '@edu/utils'

export interface IVideoAssetService {
  getResolutionId(input: GetAssetIdInput): string
  getAllResolutionsId(input: GetAllAssetsIdInput): string[]
}

export type GetAssetIdInput = {
  videoId: string
  slug: string
  resolution: '144p' | '240p' | '360p' | '480p' | '720p' | '1080p' | 'audio'
}

export type GetAllAssetsIdInput = Prettify<Omit<GetAssetIdInput, 'resolution'>>
