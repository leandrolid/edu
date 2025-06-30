import { httpClient } from '@/http/clients'

export async function createVideos({
  slug,
  onUploadProgress,
  ...input
}: {
  slug: string
  onUploadProgress: (progress: number) => void
  videos: {
    title: string
    description: string
    duration?: number
    file: File
    tags: string[]
  }[]
}) {
  return httpClient.request({
    url: `/organizations/${slug}/videos/batch`,
    method: 'POST',
    headers: {
      'Content-Type': 'multipart/form-data',
    },
    body: input,
    multipartForm: true,
    onUploadProgress: (progress) => {
      onUploadProgress(progress.progress)
    },
  })
}
