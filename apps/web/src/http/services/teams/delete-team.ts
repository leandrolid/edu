import { httpClient } from '@/http/clients'

export async function deleteTeam({ slug, teamId }: { slug: string; teamId: string }) {
  return httpClient.request<void>({
    url: `/organizations/${slug}/teams/${teamId}`,
    method: 'DELETE',
  })
}
