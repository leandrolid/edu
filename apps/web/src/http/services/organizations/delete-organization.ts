import { httpClient } from '@/http/clients'

export const deleteOrganization = async ({ slug }: { slug: string }) => {
  return httpClient.request<void>({
    url: `/organizations/${slug}`,
    method: 'DELETE',
  })
}
