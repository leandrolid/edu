import { auth } from '@/auth'
import { AdminFilter } from '@/components/teams/admin-filter'
import { MemberListSkeleton } from '@/components/teams/member-list-skeleton'
import { TeamsList } from '@/components/teams/teams-list'
import { FileXls, Plus } from '@phosphor-icons/react/dist/ssr'
import { Button, Card, DropdownMenu, Flex, Inset } from '@radix-ui/themes'
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
    <Flex direction="column" gap="4">
      <Card variant="surface" style={{ width: '100%' }}>
        <Inset side="all" p="0">
          <Flex align="center" justify="between" gap="3" p="4">
            <DropdownMenu.Root>
              <DropdownMenu.Trigger>
                <Button variant="outline" color="green" size="3">
                  Times
                </Button>
              </DropdownMenu.Trigger>
              <DropdownMenu.Content variant="soft">
                <DropdownMenu.Item asChild>
                  <Link href={`/${slug}/teams/new`} style={{ cursor: 'pointer' }}>
                    <Plus weight="regular" />
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

            <AdminFilter />
          </Flex>

          <Suspense key={search + page} fallback={<MemberListSkeleton />}>
            <TeamsList search={search} page={page} />
          </Suspense>
        </Inset>
      </Card>
    </Flex>
  )
}
