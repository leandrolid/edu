import { httpClient } from '@/http/clients'

export const deleteVideo = async ({ slug, videoId }: { slug: string; videoId: string }) => {
  return httpClient.request<void>({
    url: `/organizations/${slug}/videos/${videoId}`,
    method: 'DELETE',
  })
}
