import { Organization } from '@prisma/client'

export interface IOrganizationRepository {
  createOne(input: CreateOrganizationInput): Promise<Organization>
  updateOne(input: UpdateBySlugInput): Promise<Organization>
  findOneBySlugOrFail(slug: string): Promise<Organization>
  findManyByUserId(userId: string): Promise<Organization[]>
  deleteById(id: string): Promise<void>
}

export type CreateOrganizationInput = {
  name: string
  slug: string
  avatarUrl?: string | null
  domain?: string | null
  shouldAttachUserByDomain?: boolean
  ownerId: string
}

export type UpdateBySlugInput = {
  id: string
  name?: string
  avatarUrl?: string | null
  shouldAttachUserByDomain?: boolean
}
