import type { UpdateTeamInput } from '@app/teams/update-team/update-team.input'
import { UpdateTeamUseCase } from '@app/teams/update-team/update-team.usecase'
import type { IUser } from '@domain/dtos/user.dto'
import {
  Body,
  Controller,
  Docs,
  MiddleWares,
  Params,
  Put,
  User,
  Validate,
  type IController,
} from '@edu/framework'
import { UpdateTeamValidation } from '@infra/http/controllers/teams/update-team/update-team.validation'
import { JwtMiddleware } from '@infra/http/middlewares/jwt.middleware'

@Docs({
  title: 'Update team by ID',
  tags: ['Teams'],
})
@Controller('/organizations')
@MiddleWares(JwtMiddleware)
export class UpdateTeamController implements IController {
  constructor(private readonly updateTeamUseCase: UpdateTeamUseCase) {}

  @Put('/:slug/teams/:teamId')
  @Validate(new UpdateTeamValidation())
  async execute(
    @User() user: IUser,
    @Params() params: Pick<UpdateTeamInput, 'teamId'>,
    @Body() body: UpdateTeamInput,
  ) {
    const output = await this.updateTeamUseCase.execute({
      user,
      teamId: params.teamId,
      name: body.name,
      description: body.description,
      roles: body.roles,
      updateAllMembers: body.updateAllMembers,
    })
    return { data: output.team }
  }
}
