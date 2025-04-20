import { httpClient } from '@/http/clients'
import type { RbacRole } from '@edu/rbac'

export const getTeams = async ({
  slug,
  ...input
}: {
  slug: string
  page?: number
  pageSize?: number
  search?: string
}) => {
  return httpClient.request<GetTeamsOutput>({
    url: `/organizations/${slug}/teams`,
    method: 'GET',
    query: input,
  })
}

type GetTeamsOutput = {
  data: Array<{
    organizationId: string
    id: string
    roles: RbacRole[]
    slug: string
    name: string
    ownerId: string
  }>
  metadata: {
    page: number
    pageSize: number
    total: number
    totalPages: number
  }
}
