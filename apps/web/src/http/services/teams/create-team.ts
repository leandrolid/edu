import { httpClient } from '@/http/clients'

export async function createTeam({
  slug,
  ...input
}: {
  slug: string
  name: string
  description?: string
  roles: string[]
}) {
  return httpClient.request<void>({
    url: `/organizations/${slug}/teams`,
    method: 'POST',
    body: input,
  })
}
