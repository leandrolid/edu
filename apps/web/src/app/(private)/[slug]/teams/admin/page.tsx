import { AdminFilter } from '@/components/teams/admin-filter'
import { AdminList } from '@/components/teams/admin-list'
import { MemberListSkeleton } from '@/components/teams/member-list-skeleton'
import { XCircle } from '@phosphor-icons/react/dist/ssr'
import { Button, Card, Flex, Heading, Inset, Table } from '@radix-ui/themes'
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
          <Flex direction="column" gap="3" p="4">
            <Heading as="h5" size="4">
              Convide administradores para sua organização
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
          <Flex align="center" justify="between" gap="3" p="4">
            <Heading as="h5" size="4">
              Administradores
            </Heading>

            <AdminFilter />
          </Flex>

          <Suspense key={search + page} fallback={<MemberListSkeleton />}>
            <AdminList search={search} page={page} />
          </Suspense>
        </Inset>
      </Card>
    </Flex>
  )
}
