import type { DeleteTeamInput } from '@app/usecases/teams/delete-team/delete-team.input'
import { DeleteTeamUseCase } from '@app/usecases/teams/delete-team/delete-team.usecase'
import type { IUser } from '@domain/dtos/user.dto'
import {
  Controller,
  Delete,
  Docs,
  MiddleWares,
  Params,
  User,
  Validate,
  type IController,
} from '@edu/framework'
import { DeleteTeamValidation } from '@infra/http/controllers/teams/delete-team/delete-teams.validation'
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
    return { message: output.message }
  }
}
