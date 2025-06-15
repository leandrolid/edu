import { MemberListSkeleton } from '@/components/teams/member-list-skeleton'
import { UsersFilters } from '@/components/teams/users-filters'
import { UsersList } from '@/components/teams/users-list'
import { XCircle } from '@phosphor-icons/react/dist/ssr'
import { Button, Card, Flex, Heading, Inset, Table } from '@radix-ui/themes'
import { Suspense } from 'react'

export default async function UsersPage(props: {
  searchParams?: Promise<{
    search?: string
    page?: string
    team?: string
  }>
}) {
  const searchParams = await props.searchParams
  const page = Number(searchParams?.page) || 1
  const search = searchParams?.search || ''
  const team = searchParams?.team || 'administrador'

  return (
    <>
      <Flex direction="column" gap="4">
        <Card variant="surface" style={{ width: '100%' }}>
          <Inset side="all" p="0">
            <Flex direction="column" gap="3" p="4">
              <Heading as="h5" size="4">
                Convide usuários para sua organização
              </Heading>
              <Heading as="h6" size="2">
                Convites pendentes
              </Heading>

              <Table.Root variant="surface">
                <Table.Body>
                  <Table.Row align="center">
                    <Table.Cell justify="start">Lucas</Table.Cell>
                    <Table.Cell justify="center">ADMIN</Table.Cell>
                    <Table.Cell justify="end">
                      <Button variant="surface" color="red" size="2">
                        <XCircle weight="bold" />
                        Cancelar
                      </Button>
                    </Table.Cell>
                  </Table.Row>
                </Table.Body>
              </Table.Root>
            </Flex>
          </Inset>
        </Card>

        <Card variant="surface">
          <Inset side="all" p="0">
            <UsersFilters />

            <Suspense key={`${search}-${page}-${team}`} fallback={<MemberListSkeleton />}>
              <UsersList search={search} page={page} team={team} />
            </Suspense>
          </Inset>
        </Card>
      </Flex>
    </>
  )
}
