import type { RbacRole } from '@edu/rbac'

export interface IUser {
  id: string
  slug?: string
  organizationId?: string
  roles?: RbacRole[]
}
