import { RESOLUTIONS } from '@domain/constants/resolutions'
import { Injectable } from '@edu/framework'
import type {
  CreateAssetInput,
  GetAllAssetsIdInput,
  GetAssetIdInput,
  IVideoAssetService,
} from '@infra/services/video-resolution/video-asset.service'

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
