import { Injectable, Logger } from '@edu/framework'
import { FfmpegBuilder } from '@infra/adapters/ffmpeg/ffmpeg.builder'
import type { GetMp4StreamOutput, IFfmpegService } from '@infra/services/ffmpeg/ffmpeg.service'

@Injectable({
  token: 'IFfmpegService',
})
export class FfmpegService implements IFfmpegService {
  private readonly logger = new Logger('FFmpeg')

  public getMp4Proccessor(): GetMp4StreamOutput {
    const ffmpeg = FfmpegBuilder.init(this.logger)
      .addInput('pipe:0')
      .addVideoCodec('libx264')
      .addAudioCodec('aac')
      .addMovFlags('frag_keyframe+empty_moov+default_base_moof')
      .addBitrate('1500k')
      .addMaxRate('1500k')
      .addBufSize('1000k')
      .addFormat('mp4')
      .addOutput('pipe:1')
      .build()
    return {
      in: ffmpeg.stdin,
      out: ffmpeg.stdout,
      kill: () => ffmpeg.kill(),
      onError: (error?: unknown) => {
        ffmpeg.stdout.destroy(error as Error)
        ffmpeg.stdin.destroy(error as Error)
        ffmpeg.kill()
      },
    }
  }
}
