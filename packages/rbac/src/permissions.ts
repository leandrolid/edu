import { AppAbility } from '.'
import { Role } from './enums/role.enum'
import { AbilityBuilder } from '@casl/ability'

type DefinePermissions = (
  user: any,
  builder: AbilityBuilder<AppAbility>,
) => void

export const permissions: Record<Role, DefinePermissions> = {
  admin(user, { can }) {
    can('manage', 'all')
  },
  teacher(user, { can }) {
    can('create', 'all')
  },
  student(user, { can }) {
    can('read', 'all')
  },
}
