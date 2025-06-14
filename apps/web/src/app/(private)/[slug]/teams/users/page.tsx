import { MemberListSkeleton } from '@/components/teams/member-list-skeleton'
import { UserList } from '@/components/teams/user-list'
import { UsersSearch } from '@/components/teams/users-search'
import { Card, Flex, Heading, Inset } from '@radix-ui/themes'
import { Suspense } from 'react'

export default async function UsersPage(props: {
  searchParams?: Promise<{
    search?: string
    page?: string
  }>
}) {
  const searchParams = await props.searchParams
  const page = Number(searchParams?.page) || 1
  const search = searchParams?.search || ''

  return (
    <>
      <Flex direction="column" gap="4">
        <Card variant="surface">
          <Inset side="all" p="0">
            <Flex align="center" justify="between" gap="3" p="4">
              <Heading as="h5" size="4">
                Usuários
              </Heading>

              <UsersSearch />
            </Flex>

            <Suspense key={search + page} fallback={<MemberListSkeleton />}>
              <UserList search={search} page={page} />
            </Suspense>
          </Inset>
        </Card>
      </Flex>
    </>
  )
}
