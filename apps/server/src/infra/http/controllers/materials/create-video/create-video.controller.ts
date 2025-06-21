import type { CreateVideoInput } from '@app/materials/create-video/create-video.input'
import { CreateVideoUseCase } from '@app/materials/create-video/create-video.usecase'
import type { IUser } from '@domain/dtos/user.dto'
import {
  Controller,
  Docs,
  Form,
  MiddleWares,
  Post,
  RequestNode,
  User,
  type IController,
  type IRequestNode,
} from '@edu/framework'
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
  async execute(
    @RequestNode() request: IRequestNode,
    @User() user: IUser,
    @Form() form: CreateVideoInput,
  ) {
    const output = await this.createVideoUseCase.execute({
      user,
      file: form.file,
      onClose(callback: () => void) {
        request.once('error', () => {
          callback()
        })
      },
    } as any)
    return { data: output }
  }
}
