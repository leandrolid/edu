import type { DeleteOrganizationInput } from '@app/organizations/delete-organization/delete-organization.input'
import { Auth } from '@domain/dtos/auth.dto'
import { ForbiddenError, Inject, Injectable } from '@edu/framework'
import type { IOrganizationRepository } from '@infra/repositories/organization/organization.repository'
import type { IPermissionService } from '@infra/services/permission/permission.service'

@Injectable()
export class DeleteOrganizationUseCase {
  constructor(
    @Inject('IPermissionService') private readonly permissionService: IPermissionService,
    @Inject('IOrganizationRepository')
    private readonly organizationRepository: IOrganizationRepository,
  ) {}

  async execute({ slug, user }: Auth<DeleteOrganizationInput>) {
    const { cannot } = this.permissionService.defineAbilityFor(user)
    const rbacOrganization = this.permissionService.getOrganization(user)
    if (cannot('delete', rbacOrganization)) {
      throw new ForbiddenError('Você não tem permissão para excluir esta organização')
    }
    await this.organizationRepository.deleteBySlug(slug)
    return {
      message: 'Organização excluída com sucesso',
    }
  }
}
