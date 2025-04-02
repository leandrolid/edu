import { IOrganization } from '@domain/dtos/organization.dto'
import { IUser } from '@domain/dtos/user.dto'
import { AppAbility, RbacOrganization } from '@edu/rbac'

export interface IPermissionService {
  defineAbilityFor(user: IUser): Promise<AppAbility>
  getRbacOrganization(organization: IOrganization): RbacOrganization
}
