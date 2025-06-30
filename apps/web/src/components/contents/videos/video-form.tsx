'use client'

import { auth } from '@/auth'
import { FileInput } from '@/components/form/file-input'
import { createVideo } from '@/http/services/videos/create-video'
import { bytesToMegaBytes, secondsToMinutes, toast } from '@edu/utils'
import { Play, Trash } from '@phosphor-icons/react/dist/ssr'
import {
  Button,
  Flex,
  Heading,
  IconButton,
  Progress,
  Table,
  Text,
  TextArea,
  TextField,
} from '@radix-ui/themes'
import { useCallback, useEffect, useState, useTransition } from 'react'

export function VideoForm() {
  const [isUploading, startUploading] = useTransition()
  const [videos, setVideos] = useState<
    {
      title: string
      description: string
      url: string
      duration: number
      file: File
      tags: string[]
      progress: number
    }[]
  >([])

  useEffect(() => {
    const preventClosing = () => {
      const message = 'Você tem um upload em andamento. Tem certeza que deseja sair?'
      toast.notify({
        status: 'warning',
        message,
      })
      return message
    }
    if (isUploading) {
      window.addEventListener('beforeunload', preventClosing)
    } else {
      window.removeEventListener('beforeunload', preventClosing)
    }
  }, [isUploading])

  const handleFileChange = async (files: File[]) => {
    if (!Array.isArray(files) || files.length === 0) {
      return toast.notify({
        status: 'error',
        message: 'Selecione um arquivo de vídeo.',
      })
    }
    setVideos((prev) => [
      ...prev,
      ...Array.from(files).map((file) => ({
        title: file.name,
        description: '',
        url: URL.createObjectURL(file),
        duration: 0,
        file: file,
        tags: [],
        progress: 0,
      })),
    ])
  }

  const startUpload = useCallback(() => {
    startUploading(async () => {
      try {
        if (videos.length === 0) {
          return toast.notify({
            status: 'info',
            message: 'Nenhum arquivo selecionado para upload.',
          })
        }
        const slug = await auth.getCurrentOrganization()
        await Promise.all(
          Array.from(videos).map(async (file, index) => {
            return createVideo({
              slug: slug!,
              file: file.file,
              onProgress: ({ progress }) => {
                setVideos((prev) => {
                  return prev.map((prevFile, prevIndex) => {
                    if (prevIndex === index) {
                      return { ...prevFile, progress }
                    }
                    return prevFile
                  })
                })
              },
            })
          }),
        )
        toast.notify({
          status: 'success',
          message: 'Upload dos vídeos concluído com sucesso!',
        })
      } catch (error) {
        console.error(error)
        toast.notify({
          status: 'error',
          message: 'Erro ao fazer o upload dos vídeos',
        })
      }
    })
  }, [videos])

  return (
    <Flex direction="column" gap="4">
      <Flex justify="between" align="center" gap="2">
        <Heading as="h5" size="4">
          Criar vídeos
        </Heading>

        <Flex direction={{ initial: 'column', sm: 'row' }} gap="2">
          <Button
            variant="soft"
            color="gray"
            size="2"
            onClick={() => setVideos([])}
            disabled={isUploading}
          >
            Limpar lista
          </Button>

          <Button
            variant="solid"
            color="green"
            size="2"
            onClick={startUpload}
            disabled={isUploading}
          >
            <Play weight="fill" />
            Iniciar envio
          </Button>
        </Flex>
      </Flex>
      <FileInput
        name="video-uploader"
        accept={{
          'video/mp4': ['.mp4'],
        }}
        label="Selecione os vídeos para upload"
        onChange={handleFileChange}
      />
      <Progress
        color="green"
        value={videos.reduce((acc, file) => acc + file.progress, 0)}
        max={videos.length || 1}
        size="3"
      />
      <Table.Root>
        <Table.Header>
          <Table.Row>
            <Table.ColumnHeaderCell />
            <Table.ColumnHeaderCell>Informações</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>Metadados</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>Tags</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>Progresso</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell />
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {videos.length > 0 ? (
            videos.map((file, index) => (
              <Table.Row key={index} align="center">
                <Table.Cell width="70px">
                  <video
                    src={file.url}
                    controls={false}
                    preload="metadata"
                    style={{ width: '70px', height: 'auto' }}
                    onLoadedMetadata={(e) => {
                      const duration = e.currentTarget.duration
                      setVideos((prev) =>
                        prev.map((prevFile, prevIndex) => {
                          if (prevIndex === index) {
                            return { ...prevFile, duration }
                          }
                          return prevFile
                        }),
                      )
                    }}
                  />
                </Table.Cell>
                <Table.Cell width="20rem">
                  <Flex direction="column" gap="1">
                    <TextField.Root
                      disabled={isUploading || file.progress > 0}
                      value={file.title}
                      onChange={(e) => {
                        setVideos((prev) =>
                          prev.map((prevFile, prevIndex) => {
                            if (prevIndex === index) {
                              return { ...prevFile, title: e.target.value }
                            }
                            return prevFile
                          }),
                        )
                      }}
                    />
                    <TextArea
                      disabled={isUploading || file.progress > 0}
                      value={file.description}
                      onChange={(e) => {
                        setVideos((prev) =>
                          prev.map((prevFile, prevIndex) => {
                            if (prevIndex === index) {
                              return { ...prevFile, description: e.target.value }
                            }
                            return prevFile
                          }),
                        )
                      }}
                      placeholder="Descrição do vídeo"
                      rows={3}
                    />
                  </Flex>
                </Table.Cell>
                <Table.Cell>
                  <Flex direction="column" gap="1">
                    <Text weight="medium" color="gray">
                      {file.file.name}
                    </Text>
                    <Text size="1" color="gray">
                      {`${bytesToMegaBytes(file.file.size)} MB - ${secondsToMinutes(file.duration)}`}
                    </Text>
                  </Flex>
                </Table.Cell>
                <Table.Cell>{file.tags.join(', ')}</Table.Cell>
                <Table.Cell align="center" justify="center">
                  <Progress color="green" value={file.progress} max={1} my="3" />
                </Table.Cell>
                <Table.Cell align="center">
                  <IconButton
                    variant="outline"
                    color="red"
                    disabled={isUploading || file.progress > 0}
                    onClick={() => {
                      setVideos((prev) => prev.filter((_, i) => i !== index))
                    }}
                  >
                    <Trash weight="regular" />
                  </IconButton>
                </Table.Cell>
              </Table.Row>
            ))
          ) : (
            <Table.Row align="center">
              <Table.Cell colSpan={6} align="center">
                Nenhum arquivo selecionado
              </Table.Cell>
            </Table.Row>
          )}
        </Table.Body>
      </Table.Root>
    </Flex>
  )
}
