'use client'

import { useFormState } from '@/react/hooks/use-form-state'
import { PERMISSIONS_DESCRIPTION } from '@edu/utils'
import { Button, CheckboxCards, Flex, Separator, Strong, Text, TextField } from '@radix-ui/themes'
import { useRouter } from 'next/navigation'
import styles from './styles.module.css'

type Props = {
  action: (formData: FormData) => Promise<{
    success: boolean
    message: string | null
    errors: Record<string, string[]> | null
  }>
}

export function TeamForm({ action }: Props) {
  const router = useRouter()
  const [state, formAction, isPending] = useFormState(action, () => router.back())

  return (
    <Flex direction="column" gap="4" asChild>
      <form onSubmit={formAction}>
        <Flex direction="column" gap="1">
          <Text as="label" size="2" weight="bold" htmlFor="name">
            Nome:
          </Text>
          <TextField.Root name="name" id="name" />
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
          <TextField.Root name="description" id="description" />
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

        <Flex align="center" justify="between" gap="4">
          <Text size="1" color="gray">
            Você pode editar as permissões depois
          </Text>
          <Button loading={isPending} disabled={isPending}>
            Salvar
          </Button>
        </Flex>
      </form>
    </Flex>
  )
}
