import z from 'zod'

export const rbacOrganizationSchema = z.object({
  __typename: z.literal('Organization').default('Organization'),
  id: z.string().default(''),
  slug: z.string().default(''),
})

export type RbacOrganization = z.infer<typeof rbacOrganizationSchema>
