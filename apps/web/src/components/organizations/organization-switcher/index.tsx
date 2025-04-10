import { getOrganizations } from '@/http/services/organizations/get-organizations'
import { CaretUpDown, PlusCircle } from '@phosphor-icons/react/dist/ssr'
import { Avatar, Flex, DropdownMenu, Text, Button } from '@radix-ui/themes'
import { cookies } from 'next/headers'
import Link from 'next/link'

export const OrganizationSwitcher = async () => {
  const { data } = await getOrganizations()
  const slug = await cookies().then((cookies) => cookies.get('slug')?.value)
  const organization = data.find((org) => org.slug === slug)
  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger>
        <Button variant="ghost" color="gray" style={{ width: '10rem', margin: 0 }}>
          {organization ? (
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
          ) : (
            <Flex align="center" gap="2" width="10rem">
              <Avatar fallback="" radius="full" size="1" color="indigo" />
              <Text size="2" truncate weight="medium">
                Organização
              </Text>
            </Flex>
          )}
          <CaretUpDown weight="bold" style={{ marginLeft: 'auto', flexShrink: 0 }} />
        </Button>
      </DropdownMenu.Trigger>
      <DropdownMenu.Content variant="soft" side="bottom" align="center" style={{ padding: 0 }}>
        <DropdownMenu.Group>
          <DropdownMenu.Label>Organizações</DropdownMenu.Label>
          {data.map((organization) => (
            <DropdownMenu.Item key={organization.id} asChild>
              <Link href={`/org/${organization.slug}`} style={{ cursor: 'pointer' }}>
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
              </Link>
            </DropdownMenu.Item>
          ))}
        </DropdownMenu.Group>

        <DropdownMenu.Separator />

        <DropdownMenu.Group>
          <DropdownMenu.Item>
            <Flex align="center" gap="2" width="10rem" asChild>
              <Link href="/new-organization">
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
