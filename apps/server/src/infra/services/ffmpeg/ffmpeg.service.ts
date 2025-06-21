import type { IReadStream, IWriteStream } from '@edu/framework'

export interface IFfmpegService {
  getMp4Proccessor(): GetMp4StreamOutput
}

export type GetMp4StreamOutput = {
  in: IWriteStream
  out: IReadStream
  kill: () => void
  onError: (error?: unknown) => void
}
