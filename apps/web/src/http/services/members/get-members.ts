import { httpClient } from '@/http/clients'
import { RbacRole } from '@edu/rbac'

export const getMembers = async ({
  slug,
  team,
  ...input
}: {
  slug: string
  team: string
  page: number
  search?: string
}) => {
  return httpClient.request<GetMembersOutput>({
    url: `/organizations/${slug}/teams/${team}/members`,
    method: 'GET',
    query: input,
  })
}

type GetMembersOutput = {
  metadata: {
    page: number
    pageSize: number
    total: number
    totalPages: number
  }
  data: Array<{
    id: string
    name: string | null
    email: string | null
    slug: string
    roles: RbacRole[]
    createdAt: string
    updatedAt: string
    organizationId: string
    userId: string
    teamId: string
  }>
}
