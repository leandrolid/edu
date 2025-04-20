import { AbilityBuilder } from '@casl/ability'
import { AppAbility } from './ability'
import { RbacUser } from './entities/user.entity'
import { RbacRole } from './types/role.type'

type DefinePermissions = (user: RbacUser, builder: AbilityBuilder<AppAbility>) => void

export const permissions: Record<RbacRole, DefinePermissions> = {
  OWNER(_, { can }) {
    can('manage', 'all')
  },
  DEFAULT(user, { can }) {
    can('read', 'Organization')
    can('manage', 'User', { id: user.id })
  },
  ORGANIZATION_ADMIN(user, { can }) {
    can(['read', 'update', 'delete', 'bill'], 'Organization', { id: user.organizationId })
  },
  ORGANIZATION_CONTRIBUTOR(user, { can }) {
    can(['read', 'update'], 'Organization', { id: user.organizationId })
  },
  ORGANIZATION_MEMBER(user, { can }) {
    can('read', 'Organization', { id: user.organizationId })
  },
  ORGANIZATION_BILLING(user, { can }) {
    can(['read', 'bill'], 'Organization', { id: user.organizationId })
  },
  TEAM_ADMIN(user: RbacUser, { can }) {
    can('manage', 'Team', { organizationId: user.organizationId })
  },
  TEAM_CONTRIBUTOR(user: RbacUser, { can }) {
    can(['create', 'read', 'update'], 'Team', { organizationId: user.organizationId })
  },
  TEAM_MEMBER(user: RbacUser, { can }) {
    can('read', 'Team', { organizationId: user.organizationId })
  },
  MEMBER_ADMIN(user: RbacUser, { can }) {
    can('manage', 'Member', { organizationId: user.organizationId })
  },
  MEMBER_CONTRIBUTOR(user: RbacUser, { can }) {
    can(['create', 'read', 'update'], 'Member', { organizationId: user.organizationId })
  },
  MEMBER(user, { can }) {
    can('read', 'Member', { organizationId: user.organizationId })
  },
}
