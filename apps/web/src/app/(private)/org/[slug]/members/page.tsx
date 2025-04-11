import { auth } from '@/auth'
import { getMembers } from '@/http/services/members/get-members'
import {
  ArrowsLeftRight,
  DotsThree,
  Key,
  MagnifyingGlass,
  Trash,
  XCircle,
} from '@phosphor-icons/react/dist/ssr'
import {
  Avatar,
  Button,
  Card,
  DropdownMenu,
  Flex,
  Heading,
  IconButton,
  Inset,
  Table,
  Text,
  TextField,
} from '@radix-ui/themes'

export default async function MembersPage() {
  const slug = await auth.getCurrentOrganization()
  const { data: members } = await getMembers(slug!)
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

            <TextField.Root
              placeholder="Busque por administradores"
              size="2"
              style={{ width: '250px' }}
            >
              <TextField.Slot side="right">
                <MagnifyingGlass weight="regular" />
              </TextField.Slot>
            </TextField.Root>
          </Flex>

          <Table.Root variant="surface" style={{ borderTopLeftRadius: 0, borderTopRightRadius: 0 }}>
            <Table.Body>
              {members.map((member) => (
                <Table.Row key={member.id} align="center">
                  <Table.Cell justify="start">
                    <Flex align="center" gap="2">
                      <Avatar src="" fallback="LA" radius="full" />
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
                      {/* <Button variant="ghost" color="orange" size="2" style={{ margin: 0 }}>
                        <ArrowsLeftRight weight="bold" />
                        Transferir
                      </Button> */}

                      <DropdownMenu.Root>
                        <DropdownMenu.Trigger>
                          <IconButton variant="outline" color="gray" size="2" radius="full">
                            <DotsThree weight="bold" />
                          </IconButton>
                        </DropdownMenu.Trigger>
                        <DropdownMenu.Content align="end" side="bottom">
                          <DropdownMenu.Item>
                            <ArrowsLeftRight weight="bold" />
                            Transferir
                          </DropdownMenu.Item>
                          <DropdownMenu.Item>
                            <Key weight="bold" />
                            Permissões
                          </DropdownMenu.Item>
                          <DropdownMenu.Separator />
                          <DropdownMenu.Item color="red">
                            <Trash weight="bold" />
                            Remover
                          </DropdownMenu.Item>
                        </DropdownMenu.Content>
                      </DropdownMenu.Root>

                      {/* <Button variant="ghost" size="2" style={{ margin: 0 }}>
                        <Key weight="bold" />
                        Permissões
                      </Button>
                      <Button variant="surface" size="2" color="red">
                        <Trash weight="bold" />
                        Remover
                      </Button> */}
                    </Flex>
                  </Table.Cell>
                </Table.Row>
              ))}
            </Table.Body>
          </Table.Root>
        </Inset>
      </Card>
    </Flex>
  )
}
