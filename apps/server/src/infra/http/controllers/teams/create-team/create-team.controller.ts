import type { CreateTeamInput } from '@app/teams/create-team/create-team.input'
import { CreateTeamUseCase } from '@app/teams/create-team/create-team.usecase'
import type { IUser } from '@domain/dtos/user.dto'
import { Body, Controller, Docs, MiddleWares, Post, User, Validate } from '@infra/_injection'
import { CreateTeamValidation } from '@infra/http/controllers/teams/create-team/create-team.validation'
import type { IController } from '@infra/http/interfaces/controller'
import { JwtMiddleware } from '@infra/http/middlewares/jwt.middleware'

@Docs({
  title: 'Create one team',
  tags: ['Teams'],
})
@Controller('/organizations')
@MiddleWares(JwtMiddleware)
export class CreateTeamController implements IController {
  constructor(private readonly createTeamUseCase: CreateTeamUseCase) {}

  @Post('/:slug/teams')
  @Validate(new CreateTeamValidation())
  async execute(@User() user: IUser, @Body() body: CreateTeamInput) {
    const output = await this.createTeamUseCase.execute({
      user,
      name: body.name,
      description: body.description,
      roles: body.roles,
    })
    return { data: output.team }
  }
}
