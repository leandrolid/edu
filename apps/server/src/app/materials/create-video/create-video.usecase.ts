import type { CreateVideoInput } from '@app/materials/create-video/create-video.input'
import type { Auth } from '@domain/dtos/auth.dto'
import { ConflictError, Inject, Injectable } from '@edu/framework'
import type { IFfmpegService } from '@infra/services/ffmpeg/ffmpeg.service'
import type { IStorageService } from '@infra/services/storage/storage.service'

@Injectable()
export class CreateVideoUseCase {
  constructor(
    @Inject('IStorageService')
    private readonly storageService: IStorageService,
    @Inject('IFfmpegService')
    private readonly ffmpegService: IFfmpegService,
  ) {}

  async execute({ file }: Auth<CreateVideoInput>) {
    const inputStream = file.getFileStream()
    const ffmpeg = this.ffmpegService.getMp4Proccessor()
    try {
      inputStream.pipe(ffmpeg.in)
      // onClose(() => ffmpeg.onError())
      const { key, url } = await this.storageService.uploadStream({
        key: 'output.mp4',
        stream: ffmpeg.out,
      })
      return { key, url }
    } catch (error) {
      console.error(error)
      ffmpeg.onError(error)
      throw new ConflictError('Failed to process video stream')
    }
  }
}
