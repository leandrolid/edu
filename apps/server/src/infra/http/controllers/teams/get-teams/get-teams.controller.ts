import type { GetTeamsInput } from '@app/usecases/teams/get-teams/get-teams.input'
import { GetTeamsUseCase } from '@app/usecases/teams/get-teams/get-teams.usecase'
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
import { GetTeamsValidation } from '@infra/http/controllers/teams/get-teams/get-teams.validation'
import { JwtMiddleware } from '@infra/http/middlewares/jwt.middleware'

@Docs({
  title: 'Get all teams',
  tags: ['Teams'],
})
@Controller('/organizations')
@MiddleWares(JwtMiddleware)
export class GetTeamsController implements IController {
  constructor(private readonly getTeamsUseCase: GetTeamsUseCase) {}

  @Get('/:slug/teams')
  @Validate(new GetTeamsValidation())
  async execute(@User() user: IUser, @Query() query: GetTeamsInput) {
    const output = await this.getTeamsUseCase.execute({
      user,
      page: query.page,
      pageSize: query.pageSize,
      search: query.search,
    })
    return { data: output.teams, metadata: output.metadata }
  }
}
