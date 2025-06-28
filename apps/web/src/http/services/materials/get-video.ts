import { httpClient } from '@/http/clients'

export const getVideo = async ({ slug, videoId }: { slug: string; videoId: string }) => {
  return httpClient.request<GetVideoOutput>({
    url: `/organizations/${slug}/videos/${videoId}`,
    method: 'GET',
  })
}

export type GetVideoOutput = {
  data: {
    id: string
    createdAt: string
    updatedAt: string
    description: string | null
    organizationId: string
    ownerId: string
    title: string
    assetId: string
    baseUrl: string
    thumbnail: string
    duration: number
    views: number
    tags: string[]
    url: string
  }
}
