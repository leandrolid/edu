import z from 'zod'

export const rbacMemberSchema = z.object({
  __typename: z.literal('Member').default('Member'),
  userId: z.string(),
  organizationId: z.string(),
})

export type RbacMember = z.infer<typeof rbacMemberSchema>
