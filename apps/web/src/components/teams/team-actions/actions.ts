'use server'
import { auth } from '@/auth'
import { deleteTeam } from '@/http/services/teams/delete-team'

export async function deleteTeamAction(teamId: string) {
  const slug = await auth.getCurrentOrganization()
  await deleteTeam({ slug: slug!, teamId })
}
