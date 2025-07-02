import { RESOLUTIONS } from '@domain/constants/resolutions'
import type {
  GetAllAssetsIdInput,
  GetAssetIdInput,
  IVideoAssetService,
} from '@domain/services/video-asset.service'
import { Injectable } from '@edu/framework'

@Injectable({
  token: 'IVideoAssetService',
})
export class VideoAssetService implements IVideoAssetService {
  public getResolutionId({ slug, videoId, resolution }: GetAssetIdInput) {
    return `organizations/${slug}/videos/${videoId}/${resolution}.webm`
  }

  public getAllResolutionsId({ slug, videoId }: GetAllAssetsIdInput) {
    return RESOLUTIONS.map((resolution) => {
      return this.getResolutionId({
        slug,
        videoId,
        resolution: resolution.label,
      })
    })
  }
}
