import { ConflictError, Injectable, NotFoundError } from '@edu/framework'
import { prisma } from '@infra/database/connections/prisma.connection'
import {
  IOrganizationRepository,
  type CreateOrganizationInput,
  type UpdateBySlugInput,
} from '@infra/repositories/organization/organization.repository'
import { Organization, Prisma } from '@prisma/client'

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

  async deleteBySlug(slug: string): Promise<void> {
    try {
      await prisma.organization.delete({ where: { slug } })
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025') {
        throw new NotFoundError('Organização não encontrada')
      }
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2003') {
        throw new ConflictError(
          'Não foi possível excluir a organização. Ela está vinculada a outros recursos.',
        )
      }
      console.error(error)
      throw new ConflictError('Não foi possível excluir a organização.')
    }
  }
}
