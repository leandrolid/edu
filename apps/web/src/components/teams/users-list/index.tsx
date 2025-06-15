import { auth } from '@/auth'
import { Pagination } from '@/components/pagination'
import { getMembers } from '@/http/services/members/get-members'
import { createFallbackName, requestFallback } from '@edu/utils'
import { DotsThree, Key, Trash } from '@phosphor-icons/react/dist/ssr'
import { Avatar, DropdownMenu, Flex, IconButton, Table, Text } from '@radix-ui/themes'
import { redirect } from 'next/navigation'

export async function UsersList({
  page,
  search,
  team,
}: {
  search: string
  page: number
  team: string
}) {
  const slug = await auth.getCurrentOrganization()

  const { data: members, metadata } = await requestFallback({
    request: () =>
      getMembers({
        slug: slug!,
        team,
        page,
        search,
      }),
    onError: () => redirect('/'),
  })

  return (
    <>
      <Table.Root variant="surface" style={{ borderRadius: 0 }}>
        <Table.Body>
          {members.map((member) => (
            <Table.Row key={member.id} align="center">
              <Table.Cell justify="start">
                <Flex align="center" gap="2">
                  <Avatar
                    src={member.avatarUrl || undefined}
                    fallback={createFallbackName(member.name)}
                    radius="full"
                  />
                  <Flex direction="column" align="start" gap="1">
                    <Text size="2" weight="medium" truncate>
                      {member.name}
                    </Text>
                    <Text size="1" color="gray" truncate>
                      {member.email}
                    </Text>
                  </Flex>
                </Flex>
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
