import { Organization } from '@prisma/client'

export interface IOrganizationRepository {
  getBySlug(slug: string): Promise<Organization>
}
