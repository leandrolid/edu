import type { GetVideoInput } from '@app/usecases/videos/get-video/get-video.input'
import { GetVideoUseCase } from '@app/usecases/videos/get-video/get-video.usecase'
import type { IUser } from '@domain/dtos/user.dto'
import { Controller, Docs, Get, MiddleWares, Params, User, type IController } from '@edu/framework'
import { JwtMiddleware } from '@infra/http/middlewares/jwt.middleware'

@Controller('/organizations/:slug/videos')
@Docs({
  title: 'Get video by ID',
  tags: ['Materials'],
})
@MiddleWares(JwtMiddleware)
export class GetVideoController implements IController {
  constructor(private readonly getVideoUseCase: GetVideoUseCase) {}

  @Get('/:videoId')
  async execute(@User() user: IUser, @Params() params: GetVideoInput) {
    const output = await this.getVideoUseCase.execute({
      videoId: params.videoId,
      user,
    })
    return { data: output.video }
  }
}
