import { httpClient } from '@/http/clients'

export const getOrganization = async ({ slug }: { slug: string }) => {
  return httpClient.request<GetOrganizationOutput>({
    url: `/organizations/${slug}`,
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
