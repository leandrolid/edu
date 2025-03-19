import { Organization } from '../entities/organization.entity'

export type OrganizationSubject = [
  'manage' | 'create' | 'read' | 'update' | 'delete',
  'Organization' | Organization,
]
