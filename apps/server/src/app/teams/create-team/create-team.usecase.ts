import type { CreateTeamInput } from '@app/teams/create-team/create-team.input'
import type { Auth } from '@domain/dtos/auth.dto'
import { ForbiddenError } from '@domain/errors/forbidden.error'
import { createSlug } from '@edu/utils'
import { Inject, Injectable } from '@infra/_injection'
import type { ITeamRepository } from '@infra/repositories/team/team.repository'
import type { IPermissionService } from '@infra/services/permission/permission.service'

@Injectable()
export class CreateTeamUseCase {
  constructor(
    @Inject('IPermissionService') private readonly permissionService: IPermissionService,
    @Inject('ITeamRepository') private readonly teamRepository: ITeamRepository,
  ) {}

  async execute({ name, description, roles, user }: Auth<CreateTeamInput>) {
    const { cannot } = this.permissionService.defineAbilityFor(user)
    const rbacTeam = this.permissionService.getTeam(user)
    if (cannot('create', rbacTeam)) {
      throw new ForbiddenError('Você não tem permissão para criar times')
    }
    const team = await this.teamRepository.createOne({
      name,
      description: description || name,
      slug: createSlug(name),
      roles,
      organizationId: user.organizationId!,
      ownerId: user.id,
    })
    return { team }
  }
}
