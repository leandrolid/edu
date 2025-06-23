'use client'

import { auth } from '@/auth'
import { speedTest } from '@/http/services/materials/speed-test'
import { streamVideo } from '@/http/services/materials/stream-video'
import { AspectRatio, Flex } from '@radix-ui/themes'
import { useQuery } from '@tanstack/react-query'
import { useState } from 'react'

export function VideoPlayer() {
  const [videoSrc, setVideoSrc] = useState<string | undefined>()
  const { data: networkSpeedMbps, isSuccess } = useQuery({
    queryKey: ['networkSpeed'],
    queryFn: async () => speedTest(),
  })

  useQuery({
    enabled: isSuccess,
    queryKey: ['video'],
    queryFn: async () => {
      try {
        const slug = await auth.getCurrentOrganization()
        const response = await streamVideo({
          slug: slug!,
          videoId: 'bd99197d-1704-43dd-a9e0-15757c7744d9',
          networkSpeedMbps: networkSpeedMbps || 0,
        })
        const url = URL.createObjectURL(response)
        setVideoSrc(url)
        return ''
      } catch (error) {
        console.error(error)
        return ''
      }
    },
  })

  return (
    <AspectRatio ratio={16 / 9} style={{ width: '100%' }}>
      <Flex direction="column" gap="4" width="100%">
        {videoSrc && (
          <video controls width="100%">
            <source src={videoSrc} type="video/mp4" />
            Seu navegador não suporta o elemento de vídeo.
          </video>
        )}
      </Flex>
    </AspectRatio>
  )
}
