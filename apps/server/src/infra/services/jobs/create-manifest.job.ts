import { VideoEvent } from '@app/events/videos/video.event'
import type { IJobService, ProcessInput } from '@domain/services/queue.service'
import {
  EVENT_SERVICE,
  Inject,
  Injectable,
  InternalServerError,
  Logger,
  type IEventsService,
} from '@edu/framework'
import { BullJobAdapter } from '@infra/adapters/bull/job.adapter'
import { FfmpegBuilder } from '@infra/adapters/ffmpeg/ffmpeg.builder'
import type { TmpStorageAdapter } from '@infra/adapters/tmp-storage/tmp-storage.adapter'
import type { IStorageService } from '@infra/services/storage/storage.service'
import type { IVideoAssetService } from '@infra/services/video-assets/video-asset.service'
import { readFileSync } from 'node:fs'
import { join } from 'node:path'

export const CREATE_MANIFEST_QUEUE = 'create-manifest'

export type CreateManifestInput = {
  videoId: string
  slug: string
  assetsId: string[]
}

@Injectable()
export class CreateManifestJob
  extends BullJobAdapter<CreateManifestInput>
  implements IJobService<CreateManifestInput>
{
  private readonly logger: Logger = new Logger(CreateManifestJob.name)
  constructor(
    @Inject('IStorageService')
    private readonly storageService: IStorageService,
    @Inject(EVENT_SERVICE)
    private readonly eventsService: IEventsService,
    @Inject('ITmpStorage')
    private readonly tmpStorage: TmpStorageAdapter,
    @Inject('IVideoAssetService')
    private readonly videoAssetService: IVideoAssetService,
  ) {
    super(CREATE_MANIFEST_QUEUE)
  }

  async process({ data }: ProcessInput<CreateManifestInput>): Promise<void> {
    const tmpDir = await this.tmpStorage.createTempDir()
    try {
      const files = await this.storageService.getMany(data.assetsId)
      const tmpFiles = await Promise.all(
        files
          .sort((a, b) => a.key.localeCompare(b.key))
          .map((file) => {
            return this.tmpStorage.streamToTempFile({
              name: file.key.split('/').pop(),
              dir: tmpDir.name.split('/').pop(),
              stream: file.toStream(),
              extension: 'webm',
            })
          }),
      )
      const ffmpeg = FfmpegBuilder.init(this.logger)
        .toManifest(
          tmpFiles.map((file) => file.name),
          join(tmpDir.name, 'manifest.mpd'),
        )
        .build()
      await ffmpeg.toPromise()
      const manifestBuffer = readFileSync(join(tmpDir.name, 'manifest.mpd'))
      const manifest = await this.storageService.uploadOne({
        key: this.videoAssetService.createPath({
          slug: data.slug,
          videoId: data.videoId,
          name: 'manifest.mpd',
        }),
        buffer: manifestBuffer,
      })
      tmpDir.close()
      await this.eventsService.emit(
        VideoEvent.MANIFEST_CREATED,
        VideoEvent.create({
          assetId: manifest.key,
          videoId: data.videoId,
          slug: data.slug,
        }),
      )
    } catch (error) {
      tmpDir.close()
      this.logger.error(error)
      throw new InternalServerError('Failed to create video manifest')
    }
  }
}
