'use client'

import { auth } from '@/auth'
import { createVideo } from '@/http/services/videos/create-video'
import { Flex, Progress } from '@radix-ui/themes'
import { useState } from 'react'

export function VideoForm() {
  const [progress, setProgress] = useState(0)

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    setProgress(0)
    if (!file) return
    const slug = await auth.getCurrentOrganization()
    const output = await createVideo({
      slug: slug!,
      file,
      onProgress: ({ progress }) => {
        setProgress(progress)
      },
    })
    console.log('Video created:', output)
  }

  return (
    <Flex direction="column" gap="4">
      {progress ? (
        <Progress value={progress} max={1} />
      ) : (
        <p>Selecione um arquivo de vídeo para fazer o upload.</p>
      )}
      <input type="file" name="" id="" onChange={handleFileChange} />
    </Flex>
  )
}
