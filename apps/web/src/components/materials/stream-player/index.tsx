'use client'

import { ShakaPlayer } from '@/components/materials/stream-player/shaka'
import { NoSSRWrapper } from '@/components/nossr-wrapper'

export function StreamPlayer({
  thumbnail,
  manifestUrl,
}: {
  thumbnail: string
  manifestUrl: string
}) {
  return (
    <NoSSRWrapper>
      <ShakaPlayer thumbnail={thumbnail} manifestUrl={manifestUrl} />
    </NoSSRWrapper>
  )
}
