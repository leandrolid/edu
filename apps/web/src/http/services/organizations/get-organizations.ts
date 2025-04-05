import { httpClient } from '@/http/client'

export const getOrganizations = async () => {
  return httpClient.request<GetOrganizationsOutput>({
    url: '/organizations',
    method: 'GET',
  })
}

export type GetOrganizationsOutput = {
  data: {
    id: string
    name: string
    slug: string
    avatarUrl: string | null
  }[]
}
