import type { GetTeamInput } from '@app/teams/get-team/get-team.input'
import type { Auth } from '@domain/dtos/auth.dto'
import { ForbiddenError, Inject, Injectable, NotFoundError } from '@edu/framework'
import type { ITeamRepository } from '@infra/repositories/team/team.repository'
import type { IPermissionService } from '@infra/services/permission/permission.service'

@Injectable()
export class GetTeamUseCase {
  constructor(
    @Inject('IPermissionService') private readonly permissionService: IPermissionService,
    @Inject('ITeamRepository') private readonly teamRepository: ITeamRepository,
  ) {}

  async execute({ teamId, user }: Auth<GetTeamInput>) {
    const { cannot } = this.permissionService.defineAbilityFor(user)
    const rbacTeam = this.permissionService.getTeam(user)
    if (cannot('read', rbacTeam)) {
      throw new ForbiddenError('Você não tem permissão para acessar o time')
    }
    const team = await this.teamRepository.findById(teamId)
    if (!team) {
      throw new NotFoundError('Time não encontrado')
    }
    return { team }
  }
}
