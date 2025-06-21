'use client'

import { auth } from '@/auth'
import { Flex, Progress } from '@radix-ui/themes'
import axios from 'axios'
import { useState } from 'react'

export function VideoForm() {
  const [progress, setProgress] = useState(0)

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    setProgress(0)
    if (!file) return
    const token = await auth.getToken()
    const res = await axios.post(
      'http://localhost:3333/materials/videos',
      { file },
      {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`,
        },
        onUploadProgress(progressEvent) {
          setProgress(progressEvent.progress ?? 0)
        },
      },
    )
    console.log('Upload response:', res.data)
  }

  return (
    <Flex direction="column" gap="4">
      {progress ? (
        <Progress value={progress} max={1} />
      ) : (
        <p>Selecione um arquivo de vídeo para fazer o upload.</p>
      )}
      <input type="file" name="" id="" onChange={handleFileChange} />

      <video controls width="100%">
        <source src="http://localhost:3333/materials/videos/1/stream" type="video/mp4" />
        Seu navegador não suporta o elemento de vídeo.
      </video>
    </Flex>
  )
}
