'use client'

import { deleteTeamAction } from '@/components/teams/team-actions/actions'
import { toast } from '@edu/utils'
import { DotsThree, Key, Trash } from '@phosphor-icons/react/dist/ssr'
import { DropdownMenu, Flex, IconButton } from '@radix-ui/themes'
import Link from 'next/link'
import { useTransition } from 'react'

export function TeamActions({ teamId }: { teamId: string }) {
  const [isPending, startTransition] = useTransition()

  const handleDelete = async () => {
    startTransition(async () => {
      const state = await deleteTeamAction(teamId)
      if (!state.success) {
        toast.notify({
          message: state.message || 'Erro ao apagar o time',
          status: 'error',
        })
      }
    })
  }

  return (
    <Flex align="center" justify="end" gap="2">
      <DropdownMenu.Root>
        <DropdownMenu.Trigger>
          <IconButton loading={isPending} variant="outline" color="gray" size="2" radius="full">
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
          <DropdownMenu.Item color="red" disabled={isPending} onClick={handleDelete}>
            <Trash weight="bold" />
            Apagar
          </DropdownMenu.Item>
        </DropdownMenu.Content>
      </DropdownMenu.Root>
    </Flex>
  )
}
