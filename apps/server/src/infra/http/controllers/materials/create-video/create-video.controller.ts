import { CreateVideoUseCase } from '@app/materials/create-video/create-video.usecase'
import type { IUser } from '@domain/dtos/user.dto'
import {
  Controller,
  Docs,
  Form,
  MiddleWares,
  Params,
  Post,
  RequestNode,
  ResponseNode,
  User,
  type IController,
  type IRequestNode,
  type IResponseNode,
} from '@edu/framework'
import type {
  CreateVideoForm,
  CreateVideoParams,
} from '@infra/http/controllers/materials/create-video/create-video.validation'
import { JwtMiddleware } from '@infra/http/middlewares/jwt.middleware'

@Docs({
  title: 'Create a new video',
  tags: ['Materials'],
})
@Controller('/organizations/:slug/videos')
@MiddleWares(JwtMiddleware)
export class CreateVideoController implements IController {
  constructor(private readonly createVideoUseCase: CreateVideoUseCase) {}

  @Post('/')
  async execute(
    @RequestNode() request: IRequestNode,
    @ResponseNode() response: IResponseNode,
    @User() user: IUser,
    @Params() params: CreateVideoParams,
    @Form() form: CreateVideoForm,
  ) {
    const output = await this.createVideoUseCase.execute({
      user,
      slug: params.slug,
      file: form.file,
      onClose(callback: () => void) {
        request.once('close', () => callback())
        response.once('close', () => callback())
      },
    })
    return { data: output }
  }
}
