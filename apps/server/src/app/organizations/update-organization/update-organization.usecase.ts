import { UpdateOrganizationInput } from '@app/organizations/update-organization/update-organization.input'
import { Auth } from '@domain/dtos/auth.dto'
import { ForbiddenError } from '@domain/errors/forbidden.error'
import type { IPermissionService } from '@domain/services/permission.service'
import { Inject, Injectable } from '@infra/_injection'
import { prisma } from '@infra/database/connections/prisma.connection'

@Injectable()
export class UpdateOrganizationUseCase {
  constructor(
    @Inject('IPermissionService') private readonly permissionService: IPermissionService,
  ) {}

  async execute({
    slug,
    name,
    avatarUrl,
    shouldAttachUserByDomain,
    user,
  }: Auth<UpdateOrganizationInput>) {
    const { cannot } = await this.permissionService.defineAbilityFor(user)
    const organization = await this.permissionService.getRbacOrg(slug)
    if (cannot('update', organization)) {
      throw new ForbiddenError('Usuário não autorizado a atualizar a organização')
    }
    await prisma.organization.update({
      where: { slug },
      data: {
        name,
        avatarUrl,
        shouldAttachUserByDomain,
      },
    })
    return {
      id: organization.id,
    }
  }
}
