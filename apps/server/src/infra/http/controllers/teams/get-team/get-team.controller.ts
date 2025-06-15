import type { GetTeamInput } from '@app/teams/get-team/get-team.input'
import { GetTeamUseCase } from '@app/teams/get-team/get-team.usecase'
import type { IUser } from '@domain/dtos/user.dto'
import {
  Controller,
  Docs,
  Get,
  MiddleWares,
  Params,
  User,
  Validate,
  type IController,
} from '@edu/framework'
import { GetTeamValidation } from '@infra/http/controllers/teams/get-team/get-team.validation'
import { JwtMiddleware } from '@infra/http/middlewares/jwt.middleware'

@Docs({
  title: 'Get team by ID',
  tags: ['Teams'],
})
@Controller('/organizations')
@MiddleWares(JwtMiddleware)
export class GetTeamController implements IController {
  constructor(private readonly getTeamUseCase: GetTeamUseCase) {}

  @Get('/:slug/teams/:teamId')
  @Validate(new GetTeamValidation())
  async execute(@User() user: IUser, @Params() params: GetTeamInput) {
    const output = await this.getTeamUseCase.execute({
      user,
      teamId: params.teamId,
    })
    return { data: output.team }
  }
}
