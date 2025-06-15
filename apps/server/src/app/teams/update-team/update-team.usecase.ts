import type { UpdateTeamInput } from '@app/teams/update-team/update-team.input'
import type { Auth } from '@domain/dtos/auth.dto'
import { ForbiddenError, Inject, Injectable } from '@edu/framework'
import type { IMemberRepository } from '@infra/repositories/member/member.repository'
import type { ITeamRepository } from '@infra/repositories/team/team.repository'
import type { IPermissionService } from '@infra/services/permission/permission.service'
import type { Role } from '@prisma/client'

@Injectable()
export class UpdateTeamUseCase {
  constructor(
    @Inject('IPermissionService') private readonly permissionService: IPermissionService,
    @Inject('ITeamRepository') private readonly teamRepository: ITeamRepository,
    @Inject('IMemberRepository') private readonly memberRepository: IMemberRepository,
  ) {}

  async execute({
    teamId,
    name,
    description,
    roles,
    updateAllMembers,
    user,
  }: Auth<UpdateTeamInput>) {
    const { cannot } = this.permissionService.defineAbilityFor(user)
    const rbacTeam = this.permissionService.getTeam(user)
    if (cannot('create', rbacTeam)) {
      throw new ForbiddenError('Você não tem permissão para atualizar o time')
    }
    const team = await this.teamRepository.updateById({
      teamId,
      name,
      description: description || name,
      roles,
    })
    await this.updateMembers({ updateAllMembers, teamId, roles })
    return { team }
  }

  private async updateMembers(input: {
    updateAllMembers?: boolean
    teamId: string
    roles: Role[]
  }) {
    if (input.updateAllMembers) {
      await this.memberRepository.updatePermissionsByTeamId({
        teamId: input.teamId,
        roles: input.roles,
      })
    }
  }
}
