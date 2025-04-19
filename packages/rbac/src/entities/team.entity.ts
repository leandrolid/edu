import z from 'zod'

export const rbacTeamSchema = z.object({
  __typename: z.literal('Team').default('Team'),
  organizationId: z.string(),
})

export type RbacTeam = z.infer<typeof rbacTeamSchema>
