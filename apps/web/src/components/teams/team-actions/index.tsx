'use client'

import { deleteTeamAction } from '@/components/teams/team-actions/actions'
import { DotsThree, Key, Trash } from '@phosphor-icons/react/dist/ssr'
import { DropdownMenu, Flex, IconButton } from '@radix-ui/themes'
import { useMutation } from '@tanstack/react-query'
import Link from 'next/link'

export function TeamActions({ teamId }: { teamId: string }) {
  const { isPending, mutate: deleteTeamMutation } = useMutation({
    mutationKey: ['deleteTeam'],
    mutationFn: async () => deleteTeamAction(teamId),
  })
  return (
    <Flex align="center" justify="end" gap="2">
      <DropdownMenu.Root>
        <DropdownMenu.Trigger>
          <IconButton variant="outline" color="gray" size="2" radius="full">
            <DotsThree weight="bold" />
          </IconButton>
        </DropdownMenu.Trigger>
        <DropdownMenu.Content align="end" side="bottom">
          <DropdownMenu.Item disabled={isPending} asChild>
            <Link href={`teams/${teamId}`} style={{ cursor: 'pointer' }}>
              <Key weight="bold" />
              Permissões
            </Link>
          </DropdownMenu.Item>
          <DropdownMenu.Separator />
          <DropdownMenu.Item color="red" disabled={isPending} onClick={() => deleteTeamMutation()}>
            <Trash weight="bold" />
            Apagar
          </DropdownMenu.Item>
        </DropdownMenu.Content>
      </DropdownMenu.Root>
    </Flex>
  )
}
