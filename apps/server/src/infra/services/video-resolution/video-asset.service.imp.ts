import { RESOLUTIONS } from '@domain/constants/resolutions'
import type {
  CreateAssetInput,
  GetAllAssetsIdInput,
  GetAssetIdInput,
  IVideoAssetService,
} from '@domain/services/video-asset.service'
import { Injectable } from '@edu/framework'

@Injectable({
  token: 'IVideoAssetService',
})
export class VideoAssetService implements IVideoAssetService {
  public createPath({ slug, videoId, name }: CreateAssetInput): string {
    return `organizations/${slug}/videos/${videoId}/${name}`
  }

  public getResolutionPath({ slug, videoId, resolution }: GetAssetIdInput) {
    return `organizations/${slug}/videos/${videoId}/${resolution}.webm`
  }

  public getAllResolutionsPath({ slug, videoId }: GetAllAssetsIdInput) {
    return RESOLUTIONS.map((resolution) => {
      return this.getResolutionPath({
        slug,
        videoId,
        resolution: resolution.label,
      })
    })
  }
}
