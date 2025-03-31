import { IUser } from '@domain/dtos/user.dto'
import { defineAbilityFor, RbacOrganization, RbacUser } from '@edu/rbac'

export interface IPermissionService {
  defineAbilityFor(input: {
    user: IUser
    slug?: string
  }): Promise<ReturnType<typeof defineAbilityFor>>
  parseUser(user: { id: string; roles: string[]; slug: string }): RbacUser
  parseOrganization(organization: { id: string; slug: string }): RbacOrganization
}
