'use client'

import { ShakaPlayer } from '@/components/materials/video-player/shaka'

export function VideoPlayer() {
  return (
    <ShakaPlayer
      thumbnail={''}
      manifestUrl={
        'http://192.168.0.20:3333/organizations/macedo-nogueira/videos/6992759c-0a38-42a3-b6f2-690b445e20c8/manifest.mpd'
      }
    />
  )
}
