export class VideoEvent {
  static readonly UPLOADED = 'video.uploaded'
  static readonly PROCESSED = 'video.processed'
  static readonly MANIFEST_CREATED = 'video.manifest.created'
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
