import { httpClient } from '@/http/clients'

export const updateOrganization = async ({
  slug,
  ...input
}: {
  slug: string
  name: string
  domain: string | null
  shouldAttachUserByDomain?: boolean
}) => {
  return httpClient.request({
    url: `/organizations/${slug}`,
    method: 'PUT',
    body: input,
  })
}
