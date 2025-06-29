import { auth } from '@/auth'
import { MemberListSkeleton } from '@/components/teams/member-list-skeleton'
import { VideosFilter } from '@/components/teams/videos-filter'
import { VideosList } from '@/components/teams/videos-list'
import { Link as LinkIcon, Plus, Upload } from '@phosphor-icons/react/dist/ssr'
import { Button, Card, DropdownMenu, Flex } from '@radix-ui/themes'
import Link from 'next/link'
import { Suspense } from 'react'

export default async function VideosPage(props: {
  searchParams?: Promise<{
    search?: string
    page?: string
  }>
}) {
  const slug = await auth.getCurrentOrganization()
  const searchParams = await props.searchParams
  const page = Number(searchParams?.page) || 1
  const search = searchParams?.search || ''
  return (
    <Card style={{ padding: 0, borderCollapse: 'collapse' }}>
      <Flex align="center" justify="between" gap="3" p="6">
        <DropdownMenu.Root>
          <DropdownMenu.Trigger>
            <Button variant="outline" color="green" size="3" style={{ gap: '0.5rem' }}>
              <Plus weight="bold" />
              Vídeos
            </Button>
          </DropdownMenu.Trigger>
          <DropdownMenu.Content variant="soft">
            <DropdownMenu.Item asChild>
              <Link href="videos/new" style={{ cursor: 'pointer' }}>
                <Upload weight="regular" />
                Upload
              </Link>
            </DropdownMenu.Item>
            <DropdownMenu.Item asChild>
              <Link href="videos/import" style={{ cursor: 'pointer' }}>
                <LinkIcon weight="regular" />
                Importar
              </Link>
            </DropdownMenu.Item>
          </DropdownMenu.Content>
        </DropdownMenu.Root>

        <VideosFilter />
      </Flex>

      <Suspense key={search + page} fallback={<MemberListSkeleton />}>
        <VideosList page={page} search={search} />
      </Suspense>
    </Card>
  )
}
