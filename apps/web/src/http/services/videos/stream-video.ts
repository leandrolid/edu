import { httpClient } from '@/http/clients'

export async function streamVideo({
  slug,
  videoId,
  networkSpeedMbps,
}: {
  slug: string
  videoId: string
  networkSpeedMbps: number
}) {
  return httpClient.save({
    url: `/organizations/${slug}/videos/${videoId}/stream`,
    method: 'GET',
    headers: {
      'X-Network-Speed-Mbps': networkSpeedMbps.toString(),
    },
  })
}
