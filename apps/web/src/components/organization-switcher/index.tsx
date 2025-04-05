'use server'

import { getOrganizations } from '@/http/services/organizations/get-organizations'
import { CaretUpDown, PlusCircle } from '@phosphor-icons/react/dist/ssr'
import { Avatar, Flex, DropdownMenu, Text, Button } from '@radix-ui/themes'
import Link from 'next/link'

export const OrganizationSwitcher = async () => {
  const { data } = await getOrganizations()
  const orgnaization = ''
  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger>
        <Button variant="ghost" color="gray" style={{ width: '10rem', margin: 0 }}>
          {orgnaization ? (
            <Flex align="center" gap="2" width="10rem">
              <Avatar
                src="https://images.unsplash.com/photo-1502823403499-6ccfcf4fb453?&w=256&h=256&q=70&crop=focalpoint&fp-x=0.5&fp-y=0.3&fp-z=1&fit=crop"
                fallback="AN"
                radius="full"
                size="1"
              />
              <Text size="2" wrap="nowrap" truncate weight="medium">
                Organização 1
              </Text>
            </Flex>
          ) : (
            <Flex align="center" gap="2" width="10rem">
              <Avatar fallback="" radius="full" size="1" color="indigo" />
              <Text size="2" truncate weight="medium">
                Organização
              </Text>
            </Flex>
          )}
          <CaretUpDown weight="bold" style={{ marginLeft: 'auto' }} />
        </Button>
      </DropdownMenu.Trigger>
      <DropdownMenu.Content variant="soft" side="bottom" align="center" style={{ padding: 0 }}>
        <DropdownMenu.Group>
          <DropdownMenu.Label>Organizações</DropdownMenu.Label>
          {data.map((organization) => (
            <DropdownMenu.Item key={organization.id}>
              <Flex align="center" gap="2" width="10rem">
                <Avatar
                  src={organization.avatarUrl ?? ''}
                  fallback={getInitialsFromName(organization.name)}
                  radius="full"
                  size="1"
                />
                <Text size="2" wrap="nowrap" truncate weight="medium">
                  {organization.name}
                </Text>
              </Flex>
            </DropdownMenu.Item>
          ))}
        </DropdownMenu.Group>

        <DropdownMenu.Separator />

        <DropdownMenu.Group>
          <DropdownMenu.Item>
            <Flex align="center" gap="2" width="10rem" asChild>
              <Link href="/organizations/new">
                <PlusCircle weight="regular" fontSize="1.5rem" />
                <Text size="2" truncate weight="medium">
                  Criar nova
                </Text>
              </Link>
            </Flex>
          </DropdownMenu.Item>
        </DropdownMenu.Group>
      </DropdownMenu.Content>
    </DropdownMenu.Root>
  )
}

const getInitialsFromName = (name: string) => {
  return name
    .split(' ')
    .filter((_, index, self) => index === 0 || self.length - 1 === index)
    .map((name) => name[0])
    .join('')
}
