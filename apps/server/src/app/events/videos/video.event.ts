export class VideoEvent {
  static readonly UPLOADED = 'video.uploaded'
  static readonly PROCESSING = 'video.processing'
  static readonly PROCESSED = 'video.processed'
  static readonly ERROR = 'video.error'
  static readonly DELETED = 'video.deleted'
  static readonly UPDATED = 'video.updated'
  static readonly THUMBNAIL_UPDATED = 'video.thumbnail.updated'
  static readonly METADATA_UPDATED = 'video.metadata.updated'

  private constructor(
    public readonly videoId: string,
    public readonly slug: string,
    public readonly assetId: string,
  ) {}

  static create({ videoId, slug, assetId }: VideoEvent): VideoEvent {
    return new VideoEvent(videoId, slug, assetId)
  }
}
