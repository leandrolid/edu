import { IUser } from '@domain/dtos/user.dto'
import { AppAbility, RbacOrganization } from '@edu/rbac'
import { RbacMember } from '@edu/rbac/src/entities/member.entity'

export interface IPermissionService {
  defineAbilityFor(user: IUser): Promise<AppAbility>
  getOrganization(user: IUser): RbacOrganization
  getMember(user: IUser): RbacMember
}
