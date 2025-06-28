'use client'

import { ShakaPlayer } from '@/components/materials/stream-player/shaka'

export function StreamPlayer({
  thumbnail,
  manifestUrl,
}: {
  thumbnail: string
  manifestUrl: string
}) {
  return <ShakaPlayer thumbnail={thumbnail} manifestUrl={manifestUrl} />
}
