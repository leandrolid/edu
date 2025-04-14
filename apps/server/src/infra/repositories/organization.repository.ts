import { NotFoundError } from '@domain/errors/not-found.error'
import { IOrganizationRepository } from '@domain/repositories/organization.repository'
import { Injectable } from '@infra/_injection'
import { prisma } from '@infra/database/connections/prisma.connection'
import { Organization } from '@prisma/client'

@Injectable({
  token: 'IOrganizationRepository',
})
export class OrganizationRepository implements IOrganizationRepository {
  async getBySlug(slug: string): Promise<Organization> {
    const organization = await prisma.organization.findUnique({
      where: { slug },
    })
    if (!organization) {
      throw new NotFoundError('Organização não encontrada')
    }
    return organization
  }
}
