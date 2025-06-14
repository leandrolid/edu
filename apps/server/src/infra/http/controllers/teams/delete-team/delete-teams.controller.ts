import type { DeleteTeamInput } from '@app/teams/delete-team/delete-team.input'
import { DeleteTeamUseCase } from '@app/teams/delete-team/delete-team.usecase'
import type { IUser } from '@domain/dtos/user.dto'
import { Controller, Delete, Docs, MiddleWares, Params, User, Validate } from '@infra/_injection'
import { DeleteTeamValidation } from '@infra/http/controllers/teams/delete-team/delete-teams.validation'
import type { IController } from '@infra/http/interfaces/controller'
import { JwtMiddleware } from '@infra/http/middlewares/jwt.middleware'

@Docs({
  title: 'Delete a team',
  tags: ['Teams'],
})
@Controller('/organizations')
@MiddleWares(JwtMiddleware)
export class DeleteTeamController implements IController {
  constructor(private readonly deleteTeamUseCase: DeleteTeamUseCase) {}

  @Delete('/:slug/teams/:teamId')
  @Validate(new DeleteTeamValidation())
  async execute(@User() user: IUser, @Params() params: DeleteTeamInput) {
    const output = await this.deleteTeamUseCase.execute({
      user,
      teamId: params.teamId,
    })
    return { data: output.message }
  }
}
