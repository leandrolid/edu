import { httpClient } from '@/http/clients'

export const createOrganization = async (input: {
  name: string
  slug: string
  domain: string | null
  shouldAttachUserByDomain: boolean
  avatarUrl: string | null
}) => {
  return httpClient.request<CreateOrganizationOutput>({
    url: '/organizations',
    method: 'POST',
    body: input,
  })
}

type CreateOrganizationOutput = {
  data: {
    id: string
  }
}
