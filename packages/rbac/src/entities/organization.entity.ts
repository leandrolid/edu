import z from 'zod'

export const rbacOrganizationSchema = z.object({
  __typename: z.literal('Organization').default('Organization'),
  id: z.string(),
  ownerId: z.string(),
  slug: z.string(),
})

export type RbacOrganization = z.infer<typeof rbacOrganizationSchema>
