import { auth } from '@/auth'
import { OrganizationSwitcher } from '@/components/organizations/organization-switcher'
import { ThemeSwitcher } from '@/components/theme-switcher'
import {
  CaretDown,
  HouseSimple,
  LineVertical,
  MagnifyingGlass,
} from '@phosphor-icons/react/dist/ssr'
import { Avatar, Box, Flex, Link as StyledLink, Popover, Text, TextField } from '@radix-ui/themes'
import Link from 'next/link'

export const Header = async () => {
  const slug = await auth.getCurrentOrganization()
  return (
    <Flex
      align="center"
      justify="between"
      gap="4"
      p="4"
      asChild
      style={{
        background: 'var(--gray-2)',
        borderBottom: '1px solid var(--gray-7)',
      }}
    >
      <header>
        <Flex align="center" gap="2">
          <StyledLink
            color="gray"
            size="3"
            aria-label="Menu"
            asChild
            style={{ display: 'flex', alignItems: 'center' }}
          >
            <Link href={slug ? `/org/${slug}` : '/'}>
              <HouseSimple weight="bold" />
            </Link>
          </StyledLink>
          <LineVertical weight="bold" style={{ rotate: '20deg' }} />
          <OrganizationSwitcher />
        </Flex>

        <Box width="100%" maxWidth="500px">
          <TextField.Root
            placeholder="Busque por assuntos e aulas"
            size="3"
            style={{ width: '100%' }}
          >
            <TextField.Slot side="right">
              <MagnifyingGlass weight="bold" />
            </TextField.Slot>
          </TextField.Root>
        </Box>

        <Flex align="center" gap="2">
          <ThemeSwitcher />
          <Popover.Root>
            <Popover.Trigger>
              <Flex align="center" gap="1">
                <Avatar
                  src="https://images.unsplash.com/photo-1502823403499-6ccfcf4fb453?&w=256&h=256&q=70&crop=focalpoint&fp-x=0.5&fp-y=0.3&fp-z=1&fit=crop"
                  fallback="AN"
                  radius="full"
                />
                <CaretDown weight="bold" />
              </Flex>
            </Popover.Trigger>
            <Popover.Content>
              <Text size="3" weight="bold">
                Ainda não há nada por aqui
              </Text>
            </Popover.Content>
          </Popover.Root>
        </Flex>
      </header>
    </Flex>
  )
}
