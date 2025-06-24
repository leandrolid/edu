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
        'http://localhost:3333/organizations/macedo-nogueira/videos/7cda934c-2007-48e2-a01f-8d6142a8575a/manifest.mpd',
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
