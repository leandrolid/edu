import { auth } from '@/auth'
import { MemberListSkeleton } from '@/components/teams/member-list-skeleton'
import { TeamsFilter } from '@/components/teams/teams-filter'
import { TeamsList } from '@/components/teams/teams-list'
import { FileXls, Plus, Table } from '@phosphor-icons/react/dist/ssr'
import { Button, Card, DropdownMenu, Flex } from '@radix-ui/themes'
import Link from 'next/link'
import { Suspense } from 'react'

export default async function TeamsPage(props: {
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
    <Card style={{ width: '100%', padding: 0, borderCollapse: 'collapse' }}>
      <Flex align="center" justify="between" gap="3" p="6">
        <DropdownMenu.Root>
          <DropdownMenu.Trigger>
            <Button variant="outline" color="green" size="3" style={{ gap: '0.5rem' }}>
              <Plus weight="bold" />
              Times
            </Button>
          </DropdownMenu.Trigger>
          <DropdownMenu.Content variant="soft">
            <DropdownMenu.Item asChild>
              <Link href={`/${slug}/teams/new`} style={{ cursor: 'pointer' }}>
                <Table weight="regular" />
                Criação manual
              </Link>
            </DropdownMenu.Item>
            <DropdownMenu.Item asChild>
              <Link href={`/${slug}/teams/import-xlsx`} style={{ cursor: 'pointer' }}>
                <FileXls weight="regular" />
                Importar XLSX
              </Link>
            </DropdownMenu.Item>
          </DropdownMenu.Content>
        </DropdownMenu.Root>

        <TeamsFilter />
      </Flex>

      <Suspense key={search + page} fallback={<MemberListSkeleton />}>
        <TeamsList search={search} page={page} />
      </Suspense>
    </Card>
  )
}
