import { httpClient } from '@/http/clients'
import type { RbacRole } from '@edu/rbac'

export async function getTeam({ slug, teamId }: { slug: string; teamId: string }) {
  return httpClient.request<GetTeamOutput>({
    url: `/organizations/${slug}/teams/${teamId}`,
    method: 'GET',
  })
}

export type GetTeamOutput = {
  data: {
    id: string
    name: string
    description: string
    slug: string
    roles: RbacRole[]
    organizationId: string
    ownerId: string
  }
}
