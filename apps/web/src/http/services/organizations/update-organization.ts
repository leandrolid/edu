import { httpClient } from '@/http/clients'

export const updateOrganization = async ({
  org,
  ...input
}: {
  org: string
  name: string
  domain: string | null
  shouldAttachUserByDomain?: boolean
}) => {
  return httpClient.request({
    url: `/organizations/${org}`,
    method: 'PUT',
    body: input,
  })
}
