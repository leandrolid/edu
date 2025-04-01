import { GetOrganizationInput } from '@app/organizations/get-organization/get-organization.input'
import { Auth } from '@domain/dtos/auth.dto'
import { ForbiddenError } from '@domain/errors/forbidden.error'
import { NotFoundError } from '@domain/errors/not-found.error'
import type { IPermissionService } from '@domain/services/permission.service'
import { Inject, Injectable } from '@infra/_injection'
import { prisma } from '@infra/database/connections/prisma.connection'

@Injectable()
export class GetOrganizationUseCase {
  constructor(
    @Inject('IPermissionService') private readonly permissionService: IPermissionService,
  ) {}

  async execute({ user, slug }: Auth<GetOrganizationInput>) {
    const { cannot } = await this.permissionService.defineAbilityFor(user)
    const rbacOrganization = await this.permissionService.getRbacOrg(slug)
    if (cannot('read', rbacOrganization)) {
      throw new ForbiddenError('Você não tem permissão para acessar esta organização')
    }
    const organization = await prisma.organization.findUnique({
      where: { slug },
    })
    if (!organization) {
      throw new NotFoundError('Organização não encontrada')
    }
    return {
      id: organization.id,
      name: organization.name,
      slug: organization.slug,
      domain: organization.domain,
      avatarUrl: organization.avatarUrl,
      shouldAttachUserByDomain: organization.shouldAttachUserByDomain,
      ownerId: organization.ownerId,
      createdAt: organization.createdAt,
      updatedAt: organization.updatedAt,
    }
  }
}
