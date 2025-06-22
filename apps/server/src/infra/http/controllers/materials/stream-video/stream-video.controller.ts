import { StreamVideoUseCase } from '@app/materials/stream-video/stream-video.usecase'
import {
  Controller,
  Docs,
  Get,
  Headers,
  HttpStatusCode,
  MiddleWares,
  Params,
  ResponseNode,
  Stream,
  Validate,
  type IResponseNode,
} from '@edu/framework'
import {
  StreamVideoValidation,
  type StreamVideoHeaders,
  type StreamVideoParams,
} from '@infra/http/controllers/materials/stream-video/stream-video.validation'
import { JwtMiddleware } from '@infra/http/middlewares/jwt.middleware'

@Docs({
  title: 'Stream a video',
  tags: ['Materials'],
})
@Controller('/organizations/:slug/videos')
@MiddleWares(JwtMiddleware)
@Stream()
export class StreamVideoController {
  constructor(private readonly streamVideoUseCase: StreamVideoUseCase) {}

  @Get('/:videoId/stream')
  @Validate(new StreamVideoValidation())
  async execute(
    @Headers() headers: StreamVideoHeaders,
    @Params() params: StreamVideoParams,
    @ResponseNode() response: IResponseNode,
  ) {
    const { videoStream, start, end, videoSize, contentLength } =
      await this.streamVideoUseCase.execute({
        slug: params.slug,
        videoId: params.videoId,
        range: headers.range,
      })
    response.writeHead(HttpStatusCode.PARTIAL_CONTENT, {
      'Content-Range': `bytes ${start}-${end}/${videoSize}`,
      'Accept-Ranges': 'bytes',
      'Content-Length': contentLength,
      'Content-Type': 'video/mp4',
    })
    videoStream.pipe(response)
  }
}
