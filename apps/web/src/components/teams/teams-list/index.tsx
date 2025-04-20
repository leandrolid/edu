import { auth } from '@/auth'
import { Pagination } from '@/components/pagination'
import { getTeams } from '@/http/services/teams/get-teams'
import { errorBoundary } from '@edu/utils'
import { DotsThree, Key, Trash } from '@phosphor-icons/react/dist/ssr'
import { DropdownMenu, Flex, IconButton, Table, Text } from '@radix-ui/themes'
import { redirect } from 'next/navigation'

export async function TeamsList({ page, search }: { search: string; page: number }) {
  const slug = await auth.getCurrentOrganization()
  const { data: teams, metadata } = await errorBoundary({
    input: { slug: slug!, page: 1, pageSize: 10, search },
    request: getTeams,
    onError: () => redirect('/'),
  })

  return (
    <>
      <Table.Root variant="surface" style={{ borderRadius: 0 }}>
        <Table.Body>
          {teams.map((team) => (
            <Table.Row key={team.id} align="center">
              <Table.Cell justify="start">
                <Flex direction="column" align="start" gap="1">
                  <Text size="2" weight="medium" truncate>
                    {team.name}
                  </Text>
                  <Text size="1" color="gray" truncate>
                    {team.slug}
                  </Text>
                </Flex>
              </Table.Cell>
              <Table.Cell>
                <Text size="1" color="gray" truncate>
                  {team.roles.join(', ')}
                </Text>
              </Table.Cell>
              <Table.Cell justify="end">
                <Flex align="center" justify="end" gap="2">
                  <DropdownMenu.Root>
                    <DropdownMenu.Trigger>
                      <IconButton variant="outline" color="gray" size="2" radius="full">
                        <DotsThree weight="bold" />
                      </IconButton>
                    </DropdownMenu.Trigger>
                    <DropdownMenu.Content align="end" side="bottom">
                      <DropdownMenu.Item>
                        <Key weight="bold" />
                        Permissões
                      </DropdownMenu.Item>
                      <DropdownMenu.Separator />
                      <DropdownMenu.Item color="red">
                        <Trash weight="bold" />
                        Apagar
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
