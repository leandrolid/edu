import type { GetTeamsInput } from '@app/teams/get-teams/get-teams.input'
import type { Auth } from '@domain/dtos/auth.dto'
import { ForbiddenError, Inject, Injectable } from '@edu/framework'
import type { ITeamRepository } from '@infra/repositories/team/team.repository'
import type { IPermissionService } from '@infra/services/permission/permission.service'

@Injectable()
export class GetTeamsUseCase {
  constructor(
    @Inject('IPermissionService') private readonly permissionService: IPermissionService,
    @Inject('ITeamRepository') private readonly teamRepository: ITeamRepository,
  ) {}

  async execute({ search, page, pageSize, user }: Auth<GetTeamsInput>) {
    const { cannot } = this.permissionService.defineAbilityFor(user)
    const rbacTeam = this.permissionService.getTeam(user)
    if (cannot('read', rbacTeam)) {
      throw new ForbiddenError('Você não tem permissão para acessar os times')
    }
    const { teams, count } = await this.teamRepository.findManyAndCount({
      organizationId: user.organizationId!,
      page,
      pageSize,
      search,
    })
    return {
      metadata: {
        page,
        pageSize,
        total: count,
        totalPages: Math.ceil(count / pageSize),
      },
      teams,
    }
  }
}
