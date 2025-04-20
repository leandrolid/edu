import z from 'zod'

export const rbacRoleSchema = z.enum([
  'OWNER',
  'DEFAULT',
  'ORGANIZATION_ADMIN',
  'ORGANIZATION_CONTRIBUTOR',
  'ORGANIZATION_MEMBER',
  'ORGANIZATION_BILLING',
  'TEAM_ADMIN',
  'TEAM_CONTRIBUTOR',
  'TEAM_MEMBER',
  'MEMBER_ADMIN',
  'MEMBER_CONTRIBUTOR',
  'MEMBER',
])

export type RbacRole = z.infer<typeof rbacRoleSchema>
