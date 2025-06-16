import { CreateOrganizationInput } from '@app/organizations/create-organization/create-organization.input'
import { Auth } from '@domain/dtos/auth.dto'
import { ForbiddenError, Inject, Injectable } from '@edu/framework'
import { createSlug } from '@edu/utils'
import type { IOrganizationRepository } from '@infra/repositories/organization/organization.repository'
import type { IPermissionService } from '@infra/services/permission/permission.service'

@Injectable()
export class CreateOrganizationUseCase {
  constructor(
    @Inject('IPermissionService')
    private readonly permissionService: IPermissionService,
    @Inject('IOrganizationRepository')
    private readonly organizationRepository: IOrganizationRepository,
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
    return {
      id: organization.id,
      slug: organization.slug,
    }
  }
}
