import { httpClient } from '@/http/clients'

export async function createVideo({
  slug,
  onProgress,
  file,
}: {
  slug: string
  file: File
  onProgress: (input: { progress: number }) => void
}) {
  return httpClient.request({
    url: `/organizations/${slug}/videos`,
    method: 'POST',
    headers: {
      'Content-Type': 'multipart/form-data',
    },
    body: { file },
    multipartForm: true,
    onUploadProgress: (input) => onProgress(input),
  })
}
