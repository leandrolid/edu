import { RbacOrganization } from '../entities/organization.entity'

export type OrganizationSubject = [
  'manage' | 'create' | 'read' | 'update' | 'delete' | 'bill',
  'Organization' | RbacOrganization,
]
