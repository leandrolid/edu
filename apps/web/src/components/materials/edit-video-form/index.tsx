'use client'

import { SelectMultiple } from '@/components/form/select-multiple'
import { StreamPlayer } from '@/components/materials/stream-player'
import { createFallbackName } from '@edu/utils'
import {
  Avatar,
  Badge,
  Box,
  Button,
  Flex,
  Inset,
  Select,
  Separator,
  Skeleton,
  Text,
  TextArea,
  TextField,
} from '@radix-ui/themes'

export function EditVideoForm({
  url,
  title,
  description = '',
  thumbnail,
  tags = [],
  courses = [],
}: {
  url: string
  title: string
  description?: string
  thumbnail: string
  tags: string[]
  courses: string[]
}) {
  return (
    <Flex direction="column" gap="3" p="4">
      <Flex
        direction={{ initial: 'column', sm: 'row-reverse' }}
        align={{ initial: 'stretch', sm: 'center' }}
        gap="4"
      >
        <Box maxWidth={{ initial: '100%', sm: '20rem' }} width="100%">
          <StreamPlayer thumbnail={thumbnail} manifestUrl={url} />
        </Box>
        <Flex direction="column" gap="4" flexGrow="1">
          <Flex direction="column" gap="1">
            <Text as="label" size="2" htmlFor="title">
              Título
            </Text>
            <TextField.Root id="title" name="title" defaultValue={title} />
          </Flex>

          <Flex direction="column" gap="1">
            <Text as="label" size="2" htmlFor="description">
              Descrição
            </Text>
            <TextArea
              id="description"
              name="description"
              defaultValue={description || undefined}
              rows={4}
            />
          </Flex>
        </Flex>
      </Flex>

      <Flex direction="column" gap="1">
        <Text as="label" size="2" htmlFor="thumbnail">
          Miniatura
        </Text>
        <Flex gap="2">
          <Skeleton width="160px" height="90px" />
          <Avatar
            src={thumbnail}
            fallback={createFallbackName(title)}
            alt="Thumbnail do vídeo"
            style={{ width: '160px', height: '90px' }}
          />
        </Flex>
      </Flex>

      <Flex direction={{ initial: 'column', sm: 'row' }} gap="4">
        <Flex direction="column" gap="4" flexGrow="1">
          <Flex direction="column" gap="2">
            <Text as="label" size="2" htmlFor="tags">
              Tags
            </Text>
            <Flex direction="column" gap="3">
              <Flex direction="row" gap="2">
                {['tutorial', 'prova'].map((tag) => (
                  <Badge key={tag} variant="soft">
                    {tag}
                  </Badge>
                ))}
              </Flex>
              <TextField.Root
                id="tags"
                name="tags"
                defaultValue={tags.join(', ')}
                placeholder="Adicione tags separadas por vírgula"
                size="2"
              />
            </Flex>
          </Flex>

          <Flex direction="column" gap="2">
            <Text as="label" size="2" htmlFor="courses">
              Cursos
            </Text>
            <SelectMultiple
              id="courses"
              name="courses"
              value={[]}
              onValueChange={() => {}}
              options={[
                { value: 'course-1', label: 'Curso com um nome bem longo que pode ser cortado' },
                { value: 'course-2', label: 'Curso 2' },
                { value: 'course-3', label: 'Curso 3' },
                { value: 'course-4', label: 'Curso 4' },
              ]}
              placeholder="Adicione o vídeo a um ou mais cursos"
            />
          </Flex>
        </Flex>

        <Flex direction="column" gap="4" justify="end" width={{ initial: '100%', sm: '20rem' }}>
          <Flex direction="column" gap="2">
            <Text as="label" size="2" htmlFor="status">
              Visibilidade
            </Text>
            <Select.Root defaultValue="published">
              <Select.Trigger id="status" name="status" placeholder="Selecione o status do vídeo" />
              <Select.Content position="popper">
                <Select.Item value="published">Público</Select.Item>
                <Select.Item value="draft">Não listado</Select.Item>
                <Select.Item value="archived">Arquivado</Select.Item>
              </Select.Content>
            </Select.Root>
          </Flex>

          <Flex direction="column" gap="2">
            <Text as="label" size="2" htmlFor="subtitles">
              Legenda
            </Text>
            <Select.Root disabled>
              <Select.Trigger
                id="subtitles"
                name="subtitles"
                placeholder="Adicione legendas ao vídeo"
              />
              <Select.Content position="popper"></Select.Content>
            </Select.Root>
          </Flex>
        </Flex>
      </Flex>

      <Inset side="x" p="0" mt="4" mx="-2">
        <Separator orientation="horizontal" size="4" />
      </Inset>

      <Flex>
        <Button variant="solid" size="2" ml="auto">
          Salvar
        </Button>
      </Flex>
    </Flex>
  )
}
