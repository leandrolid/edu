import { CreateOrganizationInput } from '@app/organizations/create-organization/create-organization.input'
import { Auth } from '@domain/dtos/auth.dto'
import { ForbiddenError } from '@domain/errors/forbidden.error'
import { createSlug } from '@edu/utils'
import { Inject, Injectable } from '@infra/_injection'
import { prisma } from '@infra/database/connections/prisma.connection'
import type { IPermissionService } from '@infra/services/permission/permission.service'
import { Role } from '@prisma/client'

@Injectable()
export class CreateOrganizationUseCase {
  constructor(
    @Inject('IPermissionService')
    private readonly permissionService: IPermissionService,
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
    const organization = await prisma.organization.create({
      data: {
        name,
        slug: createSlug(name),
        avatarUrl,
        domain: !domain ? null : domain,
        shouldAttachUserByDomain,
        ownerId: user.id,
      },
    })
    const team = await prisma.team.create({
      data: {
        name: 'Administrador',
        description: 'Administrador padrão',
        slug: createSlug('Administrador'),
        organizationId: organization.id,
        roles: [Role.ORGANIZATION_ADMIN],
        ownerId: user.id,
      },
    })
    await prisma.member.create({
      data: {
        organizationId: organization.id,
        userId: user.id,
        roles: [Role.ORGANIZATION_ADMIN],
        slug: organization.slug,
        teamId: team.id,
      },
    })
    return {
      id: organization.id,
      slug: organization.slug,
    }
  }
}
