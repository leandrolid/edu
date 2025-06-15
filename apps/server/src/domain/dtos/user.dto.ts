import type { RbacRole } from '@edu/rbac'

export interface IUser {
  id: string
  owner: boolean
  slug?: string
  organizationId?: string
  roles?: RbacRole[]
}
