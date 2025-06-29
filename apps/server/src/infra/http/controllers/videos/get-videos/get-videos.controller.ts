import type { GetVideosInput } from '@app/usecases/videos/get-videos/get-videos.input'
import { GetVideosUseCase } from '@app/usecases/videos/get-videos/get-videos.usecase'
import type { IUser } from '@domain/dtos/user.dto'
import {
  Controller,
  Docs,
  Get,
  MiddleWares,
  Query,
  User,
  Validate,
  type IController,
} from '@edu/framework'
import { GetVideosValidation } from '@infra/http/controllers/videos/get-videos/get-videos.validation'
import { JwtMiddleware } from '@infra/http/middlewares/jwt.middleware'

@Controller('/organizations/:slug/videos')
@Docs({
  title: 'Get all videos',
  tags: ['Materials'],
})
@MiddleWares(JwtMiddleware)
export class GetVideosController implements IController {
  constructor(private readonly getVideosUseCase: GetVideosUseCase) {}

  @Get('/')
  @Validate(new GetVideosValidation())
  async execute(@User() user: IUser, @Query() query: GetVideosInput) {
    const output = await this.getVideosUseCase.execute({
      search: query.search,
      page: query.page,
      pageSize: query.pageSize,
      user,
    })
    return { data: output.videos, metadata: output.metadata }
  }
}
