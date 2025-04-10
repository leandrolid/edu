'use client'

import { updateOrganizationAction } from '@/app/(private)/org/[slug]/settings/actions'
import { Button, Checkbox, Flex, Heading, Separator, Text, TextField } from '@radix-ui/themes'
import { useFormState } from '@/react/hooks/use-form-state'

type Props = {
  organization?: {
    name: string
    domain: string | null
    autoJoin: boolean
  }
}

export function OrganizationForm({ organization }: Props) {
  const [state, formAction, isPending] = useFormState(updateOrganizationAction)

  return (
    <form onSubmit={formAction}>
      <Flex direction="column" gap="4" p="6">
        <Heading as="h6" size="4" mb="4">
          Configurações básicas
        </Heading>

        <Flex direction="column" gap="2">
          <Text as="label" size="2" htmlFor="name">
            Nome da organização
          </Text>
          <TextField.Root
            id="name"
            name="name"
            placeholder="Minha organização"
            size="2"
            defaultValue={organization?.name}
          />
          {state?.errors?.name && (
            <Text size="1" color="red">
              {state.errors.name[0]}
            </Text>
          )}
        </Flex>

        <Flex direction="column" gap="2">
          <Text as="label" size="2" htmlFor="domain">
            Domínio da organização
          </Text>
          <TextField.Root
            id="domain"
            name="domain"
            placeholder="exemplo.com"
            size="2"
            defaultValue={organization?.domain ?? undefined}
          />
          {state?.errors?.domain && (
            <Text size="1" color="red">
              {state.errors.domain[0]}
            </Text>
          )}
        </Flex>

        <Flex direction="column" gap="2">
          <Text as="label" size="2" htmlFor="autoJoin">
            <Checkbox
              id="autoJoin"
              name="autoJoin"
              mr="1"
              defaultChecked={organization?.autoJoin}
            />
            Auto adicionar novos membros pelo Domínio
          </Text>
        </Flex>
        {state?.errors?.autoJoin && (
          <Text size="1" color="red">
            {state.errors.autoJoin[0]}
          </Text>
        )}
      </Flex>

      <Separator orientation="horizontal" size="4" />

      <Flex p="5">
        <Button variant="solid" size="2" ml="auto" loading={isPending} disabled={isPending}>
          Salvar
        </Button>
      </Flex>
    </form>
  )
}
