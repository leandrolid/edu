'use client'

import { toast } from '@edu/utils'
import { CloudArrowUp } from '@phosphor-icons/react/dist/ssr'
import { Flex, Text } from '@radix-ui/themes'
import { useDropzone } from 'react-dropzone'
import styles from './styles.module.css'

export function FileInput({
  name,
  label,
  onChange,
  accept,
}: {
  name?: string
  label?: string
  onChange: (files: File[]) => void
  accept?: Record<string, string[]>
}) {
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept,
    multiple: true,
    onDrop: (acceptedFiles, rejectedFiles, event) => {
      onChange(acceptedFiles)
      if (rejectedFiles.length > 0) {
        toast.notify({
          status: 'error',
          message: accept
            ? `Aceito apenas arquivos ${Object.values(accept).flat().join(', ')}`
            : 'Arquivo inválido',
        })
      }
    },
    maxSize: 524_288_000, // 500mb
  })

  return (
    <div>
      <Flex
        asChild
        direction="column"
        gap="2"
        align="center"
        justify="center"
        p="4"
        minHeight="7rem"
      >
        <label
          htmlFor={name}
          className={styles.wrapper}
          data-drag-active={isDragActive}
          {...getRootProps()}
        >
          <CloudArrowUp weight="bold" />
          <Flex direction="column" gap="1" align="center">
            <Text size="3">{label || 'Arraste e solte seus arquivos aqui'}</Text>
            {accept && (
              <Text size="1" color="gray">
                Aceito somente arquivos {Object.values(accept).flat().join(', ')}
              </Text>
            )}
          </Flex>
        </label>
      </Flex>
      <input type="file" name={name} multiple {...getInputProps()} />
    </div>
  )
}
