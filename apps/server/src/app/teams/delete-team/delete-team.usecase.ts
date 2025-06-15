import type { DeleteTeamInput } from '@app/teams/delete-team/delete-team.input'
import type { Auth } from '@domain/dtos/auth.dto'
import { ForbiddenError, Inject, Injectable } from '@edu/framework'
import type { IMemberRepository } from '@infra/repositories/member/member.repository'
import type { ITeamRepository } from '@infra/repositories/team/team.repository'
import type { IPermissionService } from '@infra/services/permission/permission.service'

@Injectable()
export class DeleteTeamUseCase {
  constructor(
    @Inject('IPermissionService') private readonly permissionService: IPermissionService,
    @Inject('ITeamRepository') private readonly teamRepository: ITeamRepository,
    @Inject('IMemberRepository') private readonly memberRepository: IMemberRepository,
  ) {}

  async execute({ teamId, user }: Auth<DeleteTeamInput>) {
    const { cannot } = this.permissionService.defineAbilityFor(user)
    const rbacTeam = this.permissionService.getTeam(user)
    if (cannot('delete', rbacTeam)) {
      throw new ForbiddenError('Você não tem permissão para excluir times')
    }
    const members = await this.memberRepository.findManyByTeamId(teamId)
    if (members.length > 0) {
      throw new ForbiddenError('Não é possível excluir um time com membros associados')
    }
    await this.teamRepository.deleteById(teamId)
    return { message: 'Time excluído com sucesso' }
  }
}
