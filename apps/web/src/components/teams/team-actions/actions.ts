'use server'
import { auth } from '@/auth'
import { HttpError } from '@/http/errors/http.error'
import { deleteTeam } from '@/http/services/teams/delete-team'

export async function deleteTeamAction(teamId: string) {
  try {
    const slug = await auth.getCurrentOrganization()
    await deleteTeam({ slug: slug!, teamId })
    return { success: true, message: null, errors: null }
  } catch (error) {
    if (error instanceof HttpError) {
      return { success: false, message: error.message, errors: error.errors }
    }
    return { success: false, message: 'Por favor, tente novamente mais tarde.', errors: null }
  }
}
