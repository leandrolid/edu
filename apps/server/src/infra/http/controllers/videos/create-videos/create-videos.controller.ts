import type { CreateVideosInput } from '@app/usecases/videos/create-videos/create-videos.input'
import { CreateVideosUseCase } from '@app/usecases/videos/create-videos/create-videos.usecase'
import type { IUser } from '@domain/dtos/user.dto'
import {
  Body,
  Controller,
  Docs,
  MiddleWares,
  Post,
  User,
  Validate,
  type IController,
} from '@edu/framework'
import { CreateVideosValidation } from '@infra/http/controllers/videos/create-videos/create-videos.validation'
import { JwtMiddleware } from '@infra/http/middlewares/jwt.middleware'

@Controller('/organizations/:slug/videos')
@Docs({
  title: 'Create multiple videos',
  description:
    'This endpoint allows you to create multiple videos in a single request. It accepts a batch of video files and metadata, processes them, and returns the status of each upload.',
  tags: ['Materials'],
})
@MiddleWares(JwtMiddleware)
export class CreateVideosController implements IController {
  constructor(private readonly createVideosUseCase: CreateVideosUseCase) {}

  @Post('/batch')
  @Validate(new CreateVideosValidation())
  async execute(@User() user: IUser, @Body() body: CreateVideosInput) {
    const output = await this.createVideosUseCase.execute({ videos: body.videos, user })
    return {
      data: output,
    }
  }
}
