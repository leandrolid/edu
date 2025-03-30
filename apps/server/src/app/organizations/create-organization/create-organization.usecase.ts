import { CreateOrganizationInput } from '@app/organizations/create-organization/create-organization.input'
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
  }: CreateOrganizationInput) {
    const user = { id: '' }
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
