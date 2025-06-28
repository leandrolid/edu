import { UpdateOrganizationInput } from '@app/usecases/organizations/update-organization/update-organization.input'
import { Auth } from '@domain/dtos/auth.dto'
import { ForbiddenError, Inject, Injectable } from '@edu/framework'
import type { IOrganizationRepository } from '@infra/repositories/organization/organization.repository'
import type { IPermissionService } from '@infra/services/permission/permission.service'

@Injectable()
export class UpdateOrganizationUseCase {
  constructor(
    @Inject('IPermissionService') private readonly permissionService: IPermissionService,
    @Inject('IOrganizationRepository')
    private readonly organizationRepository: IOrganizationRepository,
  ) {}

  async execute({
    name,
    avatarUrl,
    shouldAttachUserByDomain,
    user,
  }: Auth<UpdateOrganizationInput>) {
    const { cannot } = this.permissionService.defineAbilityFor(user)
    const rbacOrganization = this.permissionService.getOrganization(user)
    if (cannot('update', rbacOrganization)) {
      throw new ForbiddenError('Usuário não autorizado a atualizar a organização')
    }
    const organization = await this.organizationRepository.updateOne({
      id: user.organizationId!,
      name,
      avatarUrl,
      shouldAttachUserByDomain,
    })
    return {
      id: organization.id,
    }
  }
}
