import z from 'zod'
import { rbacRoleSchema } from '../types/role.type'

export const rbacUserSchema = z.object({
  __typename: z.literal('User').default('User'),
  id: z.string(),
  roles: z.array(rbacRoleSchema),
  slug: z.string(),
  organizationId: z.string(),
})

export type RbacUser = z.infer<typeof rbacUserSchema>
