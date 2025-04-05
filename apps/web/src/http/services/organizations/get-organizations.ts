import { httpClient } from '@/http/clients'

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
