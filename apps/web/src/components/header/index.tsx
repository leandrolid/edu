'use client'

import { OrganizationSwitcher } from '@/components/organization-switcher'
import { CaretDown, List, MagnifyingGlass, Moon, Sun } from '@phosphor-icons/react/dist/ssr'
import {
  Avatar,
  Box,
  Button,
  Flex,
  IconButton,
  Popover,
  Text,
  TextField,
  useThemeContext,
} from '@radix-ui/themes'

export const Header = () => {
  const { appearance, onAppearanceChange } = useThemeContext()
  const selected = (
    <Button variant="ghost">
      <Avatar
        src="https://images.unsplash.com/photo-1502823403499-6ccfcf4fb453?&w=256&h=256&q=70&crop=focalpoint&fp-x=0.5&fp-y=0.3&fp-z=1&fit=crop"
        fallback="AN"
        radius="full"
        size="1"
      />
      <Text size="2" truncate weight="medium">
        Organização 1
      </Text>
    </Button>
  )

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
          <IconButton variant="ghost" color="gray" size="3" aria-label="Menu">
            <List weight="bold" />
          </IconButton>
          <OrganizationSwitcher />
          {/* <DropdownMenu.Root>
            <DropdownMenu.Trigger>{selected}</DropdownMenu.Trigger>
            <DropdownMenu.Content variant="soft" side="bottom" align="center">
              <DropdownMenu.Item>{selected}</DropdownMenu.Item>

              <DropdownMenu.Separator />

              <DropdownMenu.Item style={{ display: 'flex', gap: '0.5rem' }}>
                <PlusCircle weight="regular" />
                <Text size="2" truncate weight="medium">
                  Adicionar
                </Text>
              </DropdownMenu.Item>
            </DropdownMenu.Content>
          </DropdownMenu.Root> */}
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
          <IconButton
            variant="ghost"
            color="gray"
            onClick={() => onAppearanceChange(appearance === 'light' ? 'dark' : 'light')}
            aria-label="Theme"
          >
            {appearance === 'light' ? <Sun weight="bold" /> : <Moon weight="bold" />}
          </IconButton>
          <Popover.Root>
            <Popover.Trigger>
              <Flex align="center" gap="1">
                <CaretDown weight="bold" />
                <Avatar
                  src="https://images.unsplash.com/photo-1502823403499-6ccfcf4fb453?&w=256&h=256&q=70&crop=focalpoint&fp-x=0.5&fp-y=0.3&fp-z=1&fit=crop"
                  fallback="AN"
                  radius="full"
                />
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
