import { httpClient } from '@/http/clients'

export async function speedTest() {
  const startTime = performance.now()
  const response = await httpClient.save({
    url: 'speed',
    method: 'GET',
  })
  const endTime = performance.now()
  const durationSeconds = (endTime - startTime) / 1000
  const bitsLoaded = response.size * 8
  const mbps = bitsLoaded / durationSeconds / 1_000_000
  return mbps
}
