import { httpClient } from '@/http/clients'

export async function updateTeam({
  slug,
  teamId,
  ...input
}: {
  slug: string
  teamId: string
  name: string
  description?: string
  roles: string[]
  updateAllMembers?: boolean
}) {
  return httpClient.request({
    url: `/organizations/${slug}/teams/${teamId}`,
    method: 'PUT',
    body: input,
  })
}
