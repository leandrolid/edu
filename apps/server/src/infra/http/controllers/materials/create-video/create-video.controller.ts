import type { CreateVideoInput } from '@app/materials/create-video/create-video.input'
import { CreateVideoUseCase } from '@app/materials/create-video/create-video.usecase'
import type { IUser } from '@domain/dtos/user.dto'
import { Controller, Docs, Form, MiddleWares, Post, User, type IController } from '@edu/framework'
import { JwtMiddleware } from '@infra/http/middlewares/jwt.middleware'

@Docs({
  title: 'Create a new video',
  tags: ['Materials'],
})
@Controller('/materials')
@MiddleWares(JwtMiddleware)
export class CreateVideoController implements IController {
  constructor(private readonly createVideoUseCase: CreateVideoUseCase) {}

  @Post('/videos')
  async execute(@User() user: IUser, @Form() form: CreateVideoInput) {
    const output = await this.createVideoUseCase.execute({
      user,
      file: form.file,
    })
    return { message: output.message }
  }
}
