'use client'

import { auth } from '@/auth'
import { AspectRatio, Flex } from '@radix-ui/themes'
import { useQuery } from '@tanstack/react-query'
import { useState } from 'react'

export function VideoPlayer() {
  const [videoSrc, setVideoSrc] = useState<string | undefined>()
  const { data: networkSpeedMbps, isSuccess } = useQuery({
    queryKey: ['networkSpeed'],
    queryFn: async () => testNetworkSpeed(),
  })

  useQuery({
    enabled: isSuccess,
    queryKey: ['video'],
    queryFn: async () => {
      try {
        const token = await auth.getToken()
        const response = await fetch(
          `http://localhost:3333/organizations/macedo-nogueira/videos/bd99197d-1704-43dd-a9e0-15757c7744d9/stream`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              'X-Network-Speed-Mbps': networkSpeedMbps || '0',
              // Range: 'bytes=0-',
            },
          },
        )
        if (!response.ok) throw new Error('Failed to load video')
        const blob = await response.blob()
        const url = URL.createObjectURL(blob)
        setVideoSrc(url)
      } catch (err) {
        console.error('Error loading video:', err)
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

const testNetworkSpeed = async () => {
  const testUrl = '/music.mp3'
  const startTime = performance.now()
  const response = await fetch(testUrl)
  const blob = await response.blob()
  const endTime = performance.now()
  const durationSeconds = (endTime - startTime) / 1000
  const bitsLoaded = blob.size * 8
  const mbps = bitsLoaded / durationSeconds / 1_000_000
  return String(mbps)
}
