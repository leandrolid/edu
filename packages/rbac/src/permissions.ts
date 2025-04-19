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
    can('read', 'Organization')
    can('manage', 'User', { id: user.id })
  },
  USER(user, { can }) {
    can('read', 'Organization', { id: user.organizationId })
    can('read', 'Member', { organizationId: user.organizationId })
    can('manage', 'User', { id: user.id })
  },
  ORGANIZATION_ADMIN(user, { can }) {
    can(['read', 'update', 'delete'], 'Organization', { id: user.organizationId })
    can(['manage'], 'Member', { organizationId: user.organizationId })
    can(['manage'], 'Team', { organizationId: user.organizationId })
  },
  ORGANIZATION_CONTRIBUTOR(user, { can }) {
    can(['read', 'update'], 'Organization', { id: user.organizationId })
    can(['create', 'read', 'update'], 'Member', { organizationId: user.organizationId })
    can(['create', 'read', 'update'], 'Team', { organizationId: user.organizationId })
  },
  ORGANIZATION_MEMBER(user, { can }) {
    can('read', 'Organization', { id: user.organizationId })
    can('read', 'Member', { organizationId: user.organizationId })
    can('read', 'Team', { organizationId: user.organizationId })
  },
  ORGANIZATION_BILLING(user, { can }) {
    can(['read', 'bill'], 'Organization', { id: user.organizationId })
    can('read', 'Member', { organizationId: user.organizationId })
  },
}
