import { httpClient } from '@/http/clients'

export const getOrganization = async (org: string) => {
  return httpClient.request<GetOrganizationOutput>({
    url: `/organizations/${org}`,
    method: 'GET',
  })
}

export type GetOrganizationOutput = {
  data: {
    id: string
    name: string
    slug: string
    domain: string | null
    avatarUrl: string | null
    shouldAttachUserByDomain: boolean
    ownerId: string
    createdAt: string
    updatedAt: string
  }
}
