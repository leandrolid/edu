import { AbilityBuilder } from '@casl/ability'
import { AppAbility } from './ability'
import { RbacUser } from './entities/user.entity'
import { RbacRole } from './types/role.type'

type DefinePermissions = (user: RbacUser, builder: AbilityBuilder<AppAbility>) => void

export const permissions: Record<RbacRole, DefinePermissions> = {
  OWNER(_, { can }) {
    can('manage', 'all')
  },
  MEMBER(user, { can }) {
    can('manage', 'User', { id: user.id })
  },
  ORGANIZATION_ADMIN(user, { can }) {
    can(['read', 'update', 'delete'], 'Organization', { slug: user.slug })
  },
  ORGANIZATION_CONTRIBUTOR(user, { can }) {
    can(['read', 'update'], 'Organization', { slug: user.slug })
  },
  ORGANIZATION_MEMBER(user, { can }) {
    can('read', 'Organization', { slug: user.slug })
  },
  ORGANIZATION_BILLING(user, { can }) {
    can(['read', 'bill'], 'Organization', { slug: user.slug })
  },
}
