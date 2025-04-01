import { IUser } from '@domain/dtos/user.dto'
import { AppAbility, RbacOrganization, RbacUser } from '@edu/rbac'

export interface IPermissionService {
  defineAbilityFor(user: IUser): Promise<AppAbility>
  getRbacUser(userId: string): Promise<RbacUser>
  getRbacOrg(slug: string): Promise<RbacOrganization>
}
