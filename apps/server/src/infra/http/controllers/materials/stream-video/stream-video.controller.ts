import { StreamVideoUseCase } from '@app/materials/stream-video/stream-video.usecase'
import {
  Controller,
  Docs,
  Get,
  Headers,
  Params,
  Response,
  Stream,
  type IResponseNode,
} from '@edu/framework'

@Docs({
  title: 'Stream a video',
  tags: ['Materials'],
})
@Controller('/materials')
// @MiddleWares(JwtMiddleware)
@Stream()
export class StreamVideoController {
  constructor(private readonly streamVideoUseCase: StreamVideoUseCase) {}

  @Get('/videos/:videoId/stream')
  async execute(
    @Headers() headers: { range?: string },
    @Params() params: { videoId: string },
    @Response() response: IResponseNode,
  ) {
    const { videoStream, start, end, videoSize, contentLength } =
      await this.streamVideoUseCase.execute({
        videoId: params.videoId,
        range: headers.range,
      })
    response.writeHead(206, {
      'Content-Range': `bytes ${start}-${end}/${videoSize}`,
      'Accept-Ranges': 'bytes',
      'Content-Length': contentLength,
      'Content-Type': 'video/mp4',
    })
    videoStream.pipe(response)
  }
}
