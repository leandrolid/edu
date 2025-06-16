'use client'

import { auth } from '@/auth'
import { DeleteOrganizationAlert } from '@/components/organizations/delete-organization-alert'
import type { FormState } from '@/react/hooks/use-form-state'
import { toast } from '@edu/utils'
import { Button } from '@radix-ui/themes'
import { useTransition } from 'react'

type Props = {
  action: (slug: string) => Promise<FormState>
}

export function DeleteOrganization({ action }: Props) {
  const [isPending, startTransition] = useTransition()

  const handleDelete = async () => {
    startTransition(async () => {
      const slug = await auth.getCurrentOrganization()
      const state = await action(slug!)
      if (!state.success) {
        toast.notify({
          message: state.message || 'Erro ao excluir a organização',
          status: 'error',
        })
      }
    })
  }

  return (
    <>
      <DeleteOrganizationAlert onConfirm={handleDelete}>
        <Button variant="outline" color="red" ml="auto" loading={isPending} disabled={isPending}>
          Excluir organização
        </Button>
      </DeleteOrganizationAlert>
    </>
  )
}
