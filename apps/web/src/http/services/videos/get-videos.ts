import { httpClient } from '@/http/clients'

export const getVideos = async ({
  slug,
  ...input
}: {
  slug: string
  page?: number
  pageSize?: number
  search?: string
}) => {
  return httpClient.request<GetVideosOutput>({
    url: `/organizations/${slug}/videos`,
    method: 'GET',
    query: input,
  })
}

export type GetVideosOutput = {
  metadata: {
    page: number
    pageSize: number
    total: number
    totalPages: number
  }
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
  }[]
}
