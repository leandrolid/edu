import { StreamVideoUseCase } from '@app/usecases/videos/stream-video/stream-video.usecase'
import {
  Controller,
  Docs,
  Get,
  Headers,
  HttpStatusCode,
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
} from '@infra/http/controllers/videos/stream-video/stream-video.validation'

@Docs({
  title: 'Stream a video',
  tags: ['Materials'],
})
@Controller('/organizations/:slug/videos')
// @MiddleWares(JwtMiddleware)
@Stream()
export class StreamVideoController {
  constructor(private readonly streamVideoUseCase: StreamVideoUseCase) {}

  @Get('/:videoId/:fileName')
  @Validate(new StreamVideoValidation())
  async execute(
    @Headers() headers: StreamVideoHeaders,
    @Params() params: StreamVideoParams,
    @ResponseNode() response: IResponseNode,
  ) {
    const { videoStream, start, end, videoSize, contentLength, contentType } =
      await this.streamVideoUseCase.execute({
        slug: params.slug,
        videoId: params.videoId,
        fileName: params.fileName,
        range: headers.range,
      })
    if (contentLength === videoSize) {
      response.writeHead(HttpStatusCode.OK, {
        'Content-Length': contentLength,
        'Content-Type': contentType,
        'Access-Control-Allow-Origin': '*',
      })
    } else {
      response.writeHead(HttpStatusCode.PARTIAL_CONTENT, {
        'Content-Range': `bytes ${start}-${end}/${videoSize}`,
        'Accept-Ranges': 'bytes',
        'Content-Length': contentLength,
        'Content-Type': contentType,
        'Access-Control-Allow-Origin': '*',
      })
    }
    videoStream.pipe(response)
  }
}
