import { CreateOrganizationInput } from '@app/organizations/create-organization/create-organization.input'
import { Auth } from '@domain/dtos/auth.dto'
import { ForbiddenError, Inject, Injectable } from '@edu/framework'
import { createSlug } from '@edu/utils'
import type { IMemberRepository } from '@infra/repositories/member/member.repository'
import type { IOrganizationRepository } from '@infra/repositories/organization/organization.repository'
import type { ITeamRepository } from '@infra/repositories/team/team.repository'
import type { IPermissionService } from '@infra/services/permission/permission.service'
import { Role } from '@prisma/client'

@Injectable()
export class CreateOrganizationUseCase {
  constructor(
    @Inject('IPermissionService')
    private readonly permissionService: IPermissionService,
    @Inject('IOrganizationRepository')
    private readonly organizationRepository: IOrganizationRepository,
    @Inject('IMemberRepository') private readonly memberRepository: IMemberRepository,
    @Inject('ITeamRepository') private readonly teamRepository: ITeamRepository,
  ) {}

  async execute({
    name,
    avatarUrl,
    domain,
    shouldAttachUserByDomain,
    user,
  }: Auth<CreateOrganizationInput>) {
    const { cannot } = this.permissionService.defineAbilityFor(user)
    if (cannot('create', 'Organization')) {
      throw new ForbiddenError('Usuário não autorizado a criar uma organização')
    }
    const organization = await this.organizationRepository.createOne({
      name,
      slug: createSlug(name),
      avatarUrl,
      domain,
      shouldAttachUserByDomain,
      ownerId: user.id,
    })
    const team = await this.teamRepository.createOne({
      name: 'Administrador',
      description: 'Administrador padrão',
      slug: createSlug('Administrador'),
      organizationId: organization.id,
      roles: [Role.ORGANIZATION_ADMIN],
      ownerId: user.id,
    })
    await this.memberRepository.createOne({
      organizationId: organization.id,
      userId: user.id,
      slug: organization.slug,
      roles: team.roles,
      teamId: team.id,
    })
    return {
      id: organization.id,
      slug: organization.slug,
    }
  }
}
