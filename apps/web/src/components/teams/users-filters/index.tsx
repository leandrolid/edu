'use client'

import { auth } from '@/auth'
import { getTeams } from '@/http/services/teams/get-teams'
import { useQueryState } from '@/react/hooks/use-query-state'
import { MagnifyingGlass } from '@phosphor-icons/react/dist/ssr'
import { Flex, Select, Tabs, TextField } from '@radix-ui/themes'
import { useQuery } from '@tanstack/react-query'

export function UsersFilters() {
  const { getQueryState, setQueryState } = useQueryState()
  const {
    data: teams,
    isPending,
    isError,
  } = useQuery({
    queryKey: ['getTeams'],
    queryFn: async () => {
      const slug = await auth.getCurrentOrganization()
      const { data } = await getTeams({ slug: slug!, page: 1, pageSize: 100 })
      return data
    },
  })
  if (isPending) {
    return (
      <Tabs.Root defaultValue="loading" style={{ width: '100%' }}>
        <Tabs.List>
          <Tabs.Trigger value="loading" disabled>
            Carregando...
          </Tabs.Trigger>
        </Tabs.List>
      </Tabs.Root>
    )
  }

  if (isError || teams.length === 0) {
    return (
      <Tabs.Root defaultValue="empty" style={{ width: '100%' }}>
        <Tabs.List>
          <Tabs.Trigger value="empty" disabled>
            Nenhum time encontrado
          </Tabs.Trigger>
        </Tabs.List>
      </Tabs.Root>
    )
  }

  return (
    <Flex direction="column">
      <Tabs.Root
        style={{ width: '100%' }}
        defaultValue={getQueryState('team') || teams[0]?.slug}
        onValueChange={(value) => setQueryState({ team: value })}
      >
        <Tabs.List>
          {teams.map((team) => (
            <Tabs.Trigger key={team.slug} value={team.slug}>
              {team.name}
            </Tabs.Trigger>
          ))}
        </Tabs.List>
      </Tabs.Root>
      <Flex align="center" gap="2" mx="2" my="4">
        <Select.Root>
          <Select.Trigger placeholder="Grupo" />
          <Select.Content>
            <Select.Group>
              <Select.Label>Grupo</Select.Label>
              <Select.Item value="all">Todos</Select.Item>
              <Select.Item value="matrix">Prefeitura 1</Select.Item>
              <Select.Item value="filial">Prefeitura 2</Select.Item>
            </Select.Group>
          </Select.Content>
        </Select.Root>

        <TextField.Root
          defaultValue={getQueryState('search')?.toString()}
          onChange={({ target }) => {
            setQueryState({ search: target.value, page: '1' })
          }}
          placeholder="Busque por usuários"
          size="2"
          ml="auto"
          style={{ width: '250px' }}
        >
          <TextField.Slot side="right">
            <MagnifyingGlass weight="regular" />
          </TextField.Slot>
        </TextField.Root>
      </Flex>
    </Flex>
  )
}
