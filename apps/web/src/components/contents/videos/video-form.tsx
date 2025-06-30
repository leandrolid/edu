'use client'

import { auth } from '@/auth'
import { FileInput } from '@/components/form/file-input'
import { createVideos } from '@/http/services/videos/create-videos'
import { bytesToMegaBytes, secondsToMinutes, toast } from '@edu/utils'
import { Play, Trash } from '@phosphor-icons/react/dist/ssr'
import {
  Badge,
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
  const [progress, setProgress] = useState(0)
  const [isUploading, startUploading] = useTransition()
  const [videos, setVideos] = useState<
    {
      title: string
      description: string
      url: string
      duration: number
      file: File
      tags: string[]
    }[]
  >([])

  useEffect(() => {
    const preventClosing = (e: BeforeUnloadEvent) => {
      const message = 'Você tem um upload em andamento. Tem certeza que deseja sair?'
      e.returnValue = message
      return message
    }
    if (isUploading) {
      window.addEventListener('beforeunload', preventClosing)
    } else {
      window.removeEventListener('beforeunload', preventClosing)
    }
    return () => {
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
        description: 'Uma descrição qualquer',
        url: URL.createObjectURL(file),
        duration: 0,
        file: file,
        tags: ['masterclass', 'javascript'],
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
        await createVideos({
          slug: slug!,
          videos: videos.map((video) => ({
            title: video.title,
            description: video.description,
            duration: video.duration,
            tags: video.tags,
            file: video.file,
          })),
          onUploadProgress: (progress) => {
            setProgress(progress)
          },
        })
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
            onClick={() => {
              setVideos([])
              setProgress(0)
            }}
            disabled={isUploading}
          >
            Limpar lista
          </Button>

          <Button
            variant="solid"
            color="green"
            size="2"
            onClick={startUpload}
            disabled={isUploading || progress > 0}
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
      <Progress color="green" value={progress} max={1} size="3" />
      <Table.Root>
        <Table.Header>
          <Table.Row>
            <Table.ColumnHeaderCell />
            <Table.ColumnHeaderCell>Informações</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>Tags</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>Metadados</Table.ColumnHeaderCell>
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
                      disabled={isUploading}
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
                      disabled={isUploading}
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
                  {file.tags.map((tag, index) => (
                    <Badge key={index} variant="soft" size="1" mx="1">
                      {tag}
                    </Badge>
                  ))}
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
                <Table.Cell align="center">
                  <IconButton
                    variant="outline"
                    color="red"
                    disabled={isUploading || progress > 0}
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
