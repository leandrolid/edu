import { Injectable, NotFoundError } from '@edu/framework'
import { prisma } from '@infra/database/connections/prisma.connection'
import {
  IOrganizationRepository,
  type CreateOrganizationInput,
  type UpdateBySlugInput,
} from '@infra/repositories/organization/organization.repository'
import { Organization } from '@prisma/client'

@Injectable({
  token: 'IOrganizationRepository',
})
export class OrganizationRepository implements IOrganizationRepository {
  createOne(input: CreateOrganizationInput): Promise<Organization> {
    return prisma.organization.create({ data: input })
  }

  updateOneBySlug(input: UpdateBySlugInput): Promise<Organization> {
    return prisma.organization.update({
      where: { slug: input.slug },
      data: {
        name: input.name,
        avatarUrl: input.avatarUrl,
        shouldAttachUserByDomain: input.shouldAttachUserByDomain,
      },
    })
  }

  async findOneBySlugOrFail(slug: string): Promise<Organization> {
    const organization = await prisma.organization.findUnique({
      where: { slug },
    })
    if (!organization) {
      throw new NotFoundError('Organização não encontrada')
    }
    return organization
  }

  async findManyByUserId(userId: string): Promise<Organization[]> {
    return prisma.organization.findMany({
      where: {
        OR: [
          {
            members: { some: { userId } },
          },
          { ownerId: userId },
        ],
      },
    })
  }
}
