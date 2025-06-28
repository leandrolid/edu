import type { Organization } from '@domain/entities/organization.entity'
import type { IRepository } from '@domain/persistence/repository'
import { ConflictError, Injectable, NotFoundError } from '@edu/framework'
import { InjectRepository } from '@infra/database/decorators/inject-repository'
import {
  IOrganizationRepository,
  type CreateOrganizationInput,
  type UpdateBySlugInput,
} from '@infra/repositories/organization/organization.repository'
import { Prisma } from '@prisma/client'

@Injectable({
  token: 'IOrganizationRepository',
})
export class OrganizationRepository implements IOrganizationRepository {
  constructor(
    @InjectRepository('Organization')
    private readonly repository: IRepository<Organization>,
  ) {}

  async createOne(input: CreateOrganizationInput): Promise<Organization> {
    return this.repository.createOne(input)
  }

  async updateOne({ id, ...input }: UpdateBySlugInput): Promise<Organization> {
    return this.repository.updateOne({
      id,
      data: {
        name: input.name,
        avatarUrl: input.avatarUrl,
        shouldAttachUserByDomain: input.shouldAttachUserByDomain,
      },
    })
  }

  async findOneBySlugOrFail(slug: string): Promise<Organization> {
    const organization = await this.repository.findUnique({
      where: { slug },
    })
    if (!organization) {
      throw new NotFoundError('Organização não encontrada')
    }
    return organization
  }

  async findManyByUserId(userId: string): Promise<Organization[]> {
    return this.repository.findMany({
      where: {
        or: [
          {
            members: { some: { userId } },
          },
          { ownerId: userId },
        ],
      },
    })
  }

  async deleteById(id: string): Promise<void> {
    try {
      await this.repository.deleteById(id)
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
