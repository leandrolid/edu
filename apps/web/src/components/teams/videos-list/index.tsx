import { auth } from '@/auth'
import { Pagination } from '@/components/pagination'
import { getVideos } from '@/http/services/materials/get-videos'
import { createFallbackName, requestFallback } from '@edu/utils'
import { ChartLine, DotsThree, Trash } from '@phosphor-icons/react/dist/ssr'
import {
  Avatar,
  DropdownMenu,
  Flex,
  IconButton,
  Link as StyledLink,
  Table,
  Text,
} from '@radix-ui/themes'
import Link from 'next/link'
import { redirect } from 'next/navigation'
import styles from './styles.module.css'

export async function VideosList({ page, search }: { search: string; page: number }) {
  const slug = await auth.getCurrentOrganization()
  const { data: videos, metadata } = await requestFallback({
    request: () => getVideos({ slug: slug!, page: 1, pageSize: 10, search }),
    onError: () => redirect(`/${slug}`),
  })

  return (
    <>
      <Table.Root variant="surface" style={{ borderRadius: 0 }}>
        <Table.Header>
          <Table.Row>
            <Table.ColumnHeaderCell colSpan={2}>Video</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>Status</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>Tags</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>Data</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell align="center">Visualizações</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell />
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {videos.map((video) => (
            <Table.Row key={video.id} align="center">
              <Table.Cell>
                <Link
                  href={`/${slug}/materials/videos/${video.id}`}
                  style={{ textDecoration: 'none' }}
                >
                  <Avatar
                    src={video.thumbnail}
                    fallback={createFallbackName(video.title)}
                    alt={video.title}
                    style={{ width: 160, height: 90 }}
                  />
                </Link>
              </Table.Cell>
              <Table.Cell>
                <Flex direction="column" width="100%" maxWidth="20rem">
                  <StyledLink asChild>
                    <Link href={`/${slug}/materials/videos/${video.id}`}>
                      <Text as="p" size="2" weight="medium" truncate>
                        {video.title}
                      </Text>
                    </Link>
                  </StyledLink>
                  <Text as="p" size="1" color="gray" className={styles.lineClamp}>
                    {video.description}
                  </Text>
                </Flex>
              </Table.Cell>
              <Table.Cell>Ativo</Table.Cell>
              <Table.Cell>
                <Text size="1" color="gray" truncate>
                  {video.tags.join(', ')}
                </Text>
              </Table.Cell>
              <Table.Cell>{new Date(video.createdAt).toLocaleDateString('pt-BR')}</Table.Cell>
              <Table.Cell align="center">{video.views}</Table.Cell>
              <Table.Cell>
                <Flex align="center" justify="end" gap="2">
                  <DropdownMenu.Root>
                    <DropdownMenu.Trigger>
                      <IconButton variant="outline" color="gray" size="2" radius="full">
                        <DotsThree weight="bold" />
                      </IconButton>
                    </DropdownMenu.Trigger>
                    <DropdownMenu.Content align="end" side="bottom">
                      <DropdownMenu.Item>
                        <ChartLine weight="bold" />
                        Métricas
                      </DropdownMenu.Item>
                      <DropdownMenu.Separator />
                      <DropdownMenu.Item color="red">
                        <Trash weight="bold" />
                        Excluir
                      </DropdownMenu.Item>
                    </DropdownMenu.Content>
                  </DropdownMenu.Root>
                </Flex>
              </Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table.Root>
      <Pagination
        page={page}
        totalPages={metadata.totalPages}
        pageSize={metadata.pageSize}
        total={metadata.total}
      />
    </>
  )
}
