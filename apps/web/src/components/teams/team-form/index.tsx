'use client'

import { UpdatePermissionsAlert } from '@/components/teams/update-permissions-alert'
import { useFormState } from '@/react/hooks/use-form-state'
import { PERMISSIONS_DESCRIPTION } from '@edu/utils'
import {
  Button,
  Checkbox,
  CheckboxCards,
  Flex,
  Separator,
  Strong,
  Text,
  TextField,
} from '@radix-ui/themes'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import styles from './styles.module.css'

type Props = {
  isUpdating?: boolean
  team?: {
    id: string
    name: string
    description: string
    roles: string[]
  }
  action: (formData: FormData) => Promise<{
    success: boolean
    message: string | null
    errors: Record<string, string[]> | null
  }>
}

export function TeamForm({ isUpdating, team, action }: Props) {
  const router = useRouter()
  const [state, formAction, isPending] = useFormState(action, () => router.back())
  const [isPermissionsWarningOpen, setIsPermissionsWarningOpen] = useState(false)
  const [isUpdateAllEnabled, setIsUpdateAllEnabled] = useState(false)

  const handleUpdateAll = (checked: boolean) => {
    if (!checked) return setIsUpdateAllEnabled(false)
    setIsPermissionsWarningOpen(true)
  }

  return (
    <Flex direction="column" gap="4" asChild>
      <form onSubmit={formAction}>
        <input type="hidden" name="teamId" value={team?.id} />
        <Flex direction="column" gap="1">
          <Text as="label" size="2" weight="bold" htmlFor="name">
            Nome:
          </Text>
          <TextField.Root name="name" id="name" defaultValue={team?.name} />
          {state.errors?.name && (
            <Text size="1" color="red">
              {state.errors.name[0]}
            </Text>
          )}
        </Flex>

        <Flex direction="column" gap="1">
          <Text as="label" size="2" weight="bold" htmlFor="description">
            Descrição (opcional):
          </Text>
          <TextField.Root name="description" id="description" defaultValue={team?.description} />
          {state.errors?.description && (
            <Text size="1" color="red">
              {state.errors.description[0]}
            </Text>
          )}
        </Flex>

        <Flex direction="column" gap="1">
          <Text size="2" color="gray">
            Selecione as permissões que deseja conceder a este time:
          </Text>
          {state.errors?.roles && (
            <Text size="1" color="red">
              {state.errors.roles[0]}
            </Text>
          )}
        </Flex>
        <CheckboxCards.Root
          columns={{ initial: '1', sm: '2' }}
          gap="4"
          variant="surface"
          name="roles"
          defaultValue={team?.roles}
        >
          {PERMISSIONS_DESCRIPTION.map((permission) => (
            <CheckboxCards.Item
              key={permission.value}
              value={permission.value}
              className={styles.card}
            >
              <Flex direction="column" gap="1">
                <Strong>{permission.name}</Strong>
                <Text size="2" color="gray">
                  {permission.description}
                </Text>
              </Flex>
            </CheckboxCards.Item>
          ))}
        </CheckboxCards.Root>

        <Separator orientation="horizontal" decorative size="4" />

        <Flex direction={{ initial: 'column', sm: 'row' }} align="center" justify="between" gap="4">
          {isUpdating ? (
            <Text as="label" size="2">
              <Flex gap="2">
                <Checkbox
                  name="updateAllMembers"
                  checked={isUpdateAllEnabled}
                  onCheckedChange={handleUpdateAll}
                />
                Atualizar permissões de todos os usuários deste time
              </Flex>
            </Text>
          ) : (
            <Text size="1" color="gray">
              Você pode editar as permissões depois
            </Text>
          )}
          <Flex gap="2" ml={{ initial: 'unset', sm: 'auto' }}>
            <Button
              variant="outline"
              color="gray"
              loading={isPending}
              disabled={isPending}
              onClick={() => router.back()}
              type="button"
            >
              Cancelar
            </Button>
            <Button loading={isPending} disabled={isPending}>
              Salvar
            </Button>
          </Flex>
        </Flex>

        {isPermissionsWarningOpen && (
          <UpdatePermissionsAlert
            onCancel={() => {
              setIsPermissionsWarningOpen(false)
              setIsUpdateAllEnabled(false)
            }}
            onConfirm={() => {
              setIsPermissionsWarningOpen(false)
              setIsUpdateAllEnabled(true)
            }}
          />
        )}
      </form>
    </Flex>
  )
}
