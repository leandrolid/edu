import type { IUser } from '@domain/dtos/user.dto'
import { type AppAbility, type RbacMember, type RbacOrganization, type RbacTeam } from '@edu/rbac'

export interface IPermissionService {
  defineAbilityFor(user: IUser): AppAbility
  getOrganization(user: IUser): RbacOrganization
  getMember(user: IUser): RbacMember
  getTeam(user: IUser): RbacTeam
}
