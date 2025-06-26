import { GetOrganizationInput } from '@app/usecases/organizations/get-organization/get-organization.input'
import { Auth } from '@domain/dtos/auth.dto'
import { ForbiddenError, Inject, Injectable } from '@edu/framework'
import type { IOrganizationRepository } from '@infra/repositories/organization/organization.repository'
import type { IPermissionService } from '@infra/services/permission/permission.service'

@Injectable()
export class GetOrganizationUseCase {
  constructor(
    @Inject('IPermissionService') private readonly permissionService: IPermissionService,
    @Inject('IOrganizationRepository')
    private readonly organizationRepository: IOrganizationRepository,
  ) {}

  async execute({ user, slug }: Auth<GetOrganizationInput>) {
    const { cannot } = this.permissionService.defineAbilityFor(user)
    const rbacOrganization = this.permissionService.getOrganization(user)
    if (cannot('read', rbacOrganization)) {
      throw new ForbiddenError('Você não tem permissão para acessar esta organização')
    }
    const organization = await this.organizationRepository.findOneBySlugOrFail(slug)
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
