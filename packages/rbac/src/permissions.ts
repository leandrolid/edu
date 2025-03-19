import { AppAbility } from './ability'
import { User } from './entities/user.entity'
import { Role } from './types/role.type'
import { AbilityBuilder } from '@casl/ability'

type DefinePermissions = (user: User, builder: AbilityBuilder<AppAbility>) => void

export const permissions: Record<Role, DefinePermissions> = {
  super_admin(_, { can }) {
    can('manage', 'all')
  },
  admin(user, { can }) {
    can('manage', 'User')
    can(['read', 'update'], 'Organization', { slug: user.organization })
  },
  teacher(user, { can }) {
    can('update', 'User', { id: { $eq: user.id } })
  },
  student(user, { can }) {},
}
