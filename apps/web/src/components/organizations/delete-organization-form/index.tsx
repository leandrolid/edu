'use client'

import { auth } from '@/auth'
import type { FormState } from '@/react/hooks/use-form-state'
import { toast } from '@edu/utils'
import { Button, Flex } from '@radix-ui/themes'
import { useTransition } from 'react'

type Props = {
  action: (slug: string) => Promise<FormState>
}

export function DeleteOrganizationForm({ action }: Props) {
  const [isPending, startTransition] = useTransition()

  const handleDelete = async () => {
    startTransition(async () => {
      const slug = await auth.getCurrentOrganization()
      const state = await action('')
      if (!state.success) {
        toast.notify({
          message: state.message || 'Erro ao excluir a organização',
          status: 'error',
        })
      }
    })
  }

  return (
    <Flex direction={{ initial: 'column', xs: 'row' }} p="5" gap="4">
      <Button
        variant="outline"
        color="red"
        ml="auto"
        loading={isPending}
        disabled={isPending}
        onClick={handleDelete}
      >
        Excluir organização
      </Button>
    </Flex>
  )
}
