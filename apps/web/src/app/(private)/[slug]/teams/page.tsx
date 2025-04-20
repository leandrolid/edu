import { AdminFilter } from '@/components/teams/admin-filter'
import { MemberListSkeleton } from '@/components/teams/member-list-skeleton'
import { TeamsList } from '@/components/teams/teams-list'
import { Card, Flex, Heading, Inset } from '@radix-ui/themes'
import { Suspense } from 'react'

export default async function AdminPage(props: {
  searchParams?: Promise<{
    search?: string
    page?: string
  }>
}) {
  const searchParams = await props.searchParams
  const page = Number(searchParams?.page) || 1
  const search = searchParams?.search || ''
  return (
    <Flex direction="column" gap="4">
      <Card variant="surface" style={{ width: '100%' }}>
        <Inset side="all" p="0">
          <Flex align="center" justify="between" gap="3" p="4">
            <Heading as="h5" size="4">
              Times
            </Heading>

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
