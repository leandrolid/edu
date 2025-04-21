import { Auth } from '@domain/dtos/auth.dto'
import { ForbiddenError } from '@domain/errors/forbidden.error'
import { Inject, Injectable } from '@infra/_injection'
import { prisma } from '@infra/database/connections/prisma.connection'
import type { IPermissionService } from '@infra/services/permission/permission.service'

@Injectable()
export class GetOrganizationsUseCase {
  constructor(
    @Inject('IPermissionService') private readonly permissionService: IPermissionService,
  ) {}

  async execute({ user }: Auth) {
    const { cannot } = this.permissionService.defineAbilityFor(user)
    if (cannot('read', 'Organization')) {
      throw new ForbiddenError('Você não tem permissão para listar organizações')
    }
    const organizations = await prisma.organization.findMany({
      where: {
        OR: [
          {
            members: { some: { userId: user.id } },
          },
          { ownerId: user.id },
        ],
      },
    })
    return {
      organizations: organizations.map((org) => ({
        id: org.id,
        name: org.name,
        slug: org.slug,
        avatarUrl: org.avatarUrl,
      })),
    }
  }
}
