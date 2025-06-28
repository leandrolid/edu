import type { DeleteVideoInput } from '@app/usecases/materials/delete-video/delete-video.input'
import { DeleteVideoUseCase } from '@app/usecases/materials/delete-video/delete-video.usecase'
import type { IUser } from '@domain/dtos/user.dto'
import {
  Body,
  Controller,
  Delete,
  Docs,
  MiddleWares,
  Params,
  type IController,
} from '@edu/framework'
import { JwtMiddleware } from '@infra/http/middlewares/jwt.middleware'

@Controller('/organizations/:slug/videos')
@Docs({
  title: 'Delete a video',
  tags: ['Materials'],
})
@MiddleWares(JwtMiddleware)
export class DeleteVideoController implements IController {
  constructor(private readonly deleteVideoUseCase: DeleteVideoUseCase) {}

  @Delete('/:videoId')
  async execute(@Body() user: IUser, @Params() params: DeleteVideoInput) {
    const output = await this.deleteVideoUseCase.execute({
      user,
      videoId: params.videoId,
    })
    return { message: output.message }
  }
}
