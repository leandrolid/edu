'use client'

import { AspectRatio, Flex } from '@radix-ui/themes'
import { useQuery } from '@tanstack/react-query'

export function VideoPlayer() {
  useQuery({
    queryKey: ['video'],
    queryFn: async () => {
      const dashjs = await import('dashjs')
      await import('dashjs/mss')
      let player = dashjs.MediaPlayer().create()
      const container = document.querySelector<HTMLMediaElement>('#myMainVideoPlayer')
      if (!container) return null
      player.initialize(
        container,
        'http://localhost:3333/organizations/macedo-nogueira/videos/55513c23-328e-4a0c-aea9-68c2c94f913d/manifest.mpd',
        false,
      )
      return player
    },
  })

  return (
    <AspectRatio ratio={16 / 9} style={{ width: '100%' }}>
      <Flex direction="column" gap="4" width="100%">
        <video id="myMainVideoPlayer" controls width="100%">
          Seu navegador não suporta o elemento de vídeo.
        </video>
      </Flex>
    </AspectRatio>
  )
}
