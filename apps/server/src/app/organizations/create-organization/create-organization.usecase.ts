import { CreateOrganizationInput } from '@app/organizations/create-organization/create-organization.input'
import { Auth } from '@domain/dtos/auth.dto'
import { ForbiddenError } from '@domain/errors/forbidden.error'
import { Injectable } from '@infra/_injection'
import { prisma } from '@infra/database/connections/prisma.connection'

@Injectable()
export class CreateOrganizationUseCase {
  async execute({
    name,
    slug,
    avatarUrl,
    domain,
    shouldAttachUserByDomain,
    user,
  }: Auth<CreateOrganizationInput>) {
    console.log('CreateOrganizationUseCase', user)
    const isUserAllowed = false
    if (!isUserAllowed) {
      throw new ForbiddenError('Usuário não autorizado a criar uma organização')
    }
    const organization = await prisma.organization.create({
      data: {
        name,
        slug,
        avatarUrl,
        domain,
        shouldAttachUserByDomain,
        ownerId: user.id,
      },
    })
    return {
      id: organization.id,
    }
  }
}
