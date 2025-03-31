import z from 'zod'

export const rbacRoleSchema = z.enum([
  'OWNER',
  'MEMBER',
  'ORGANIZATION_ADMIN',
  'ORGANIZATION_CONTRIBUTOR',
  'ORGANIZATION_MEMBER',
  'ORGANIZATION_BILLING',
])

export type RbacRole = z.infer<typeof rbacRoleSchema>
