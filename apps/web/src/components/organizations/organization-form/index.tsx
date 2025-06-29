'use client'

import { useFormState, type FormState } from '@/react/hooks/use-form-state'
import { Button, Checkbox, Flex, Separator, Text, TextField } from '@radix-ui/themes'

type Props = {
  organization?: {
    name: string
    slug: string
    domain: string | null
    shouldAttachUserByDomain: boolean
    avatarUrl: string | null
  }
  isUpdating?: boolean
  action: (data: FormData) => Promise<FormState>
}

export function OrganizationForm({ organization, isUpdating, action }: Props) {
  const [state, formAction, isPending] = useFormState(action)

  return (
    <Flex asChild direction="column" gap="4">
      <form onSubmit={formAction}>
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

        {!isUpdating && (
          <Flex direction="column" gap="2">
            <Text as="label" size="2" htmlFor="slug">
              Slug da organização
            </Text>
            <TextField.Root
              id="slug"
              name="slug"
              placeholder="minha-organizacao"
              size="2"
              defaultValue={organization?.slug}
            />
            {state?.errors?.slug && (
              <Text size="1" color="red">
                {state.errors.slug[0]}
              </Text>
            )}
          </Flex>
        )}

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
          <Text as="label" size="2" htmlFor="shouldAttachUserByDomain">
            <Checkbox
              id="shouldAttachUserByDomain"
              name="shouldAttachUserByDomain"
              mr="1"
              defaultChecked={organization?.shouldAttachUserByDomain}
            />
            Auto adicionar novos membros pelo Domínio
          </Text>
          {state?.errors?.autoJoin && (
            <Text size="1" color="red">
              {state.errors.autoJoin[0]}
            </Text>
          )}
        </Flex>

        <Flex direction="column" gap="2">
          <Text as="label" size="2" htmlFor="avatarUrl">
            Logo da organização
          </Text>
          <TextField.Root
            id="avatarUrl"
            name="avatarUrl"
            placeholder="exemplo.com"
            size="2"
            defaultValue={organization?.avatarUrl ?? undefined}
          />
          {state?.errors?.avatarUrl && (
            <Text size="1" color="red">
              {state.errors.avatarUrl[0]}
            </Text>
          )}
        </Flex>

        <Separator orientation="horizontal" size="4" />

        <Flex>
          <Button variant="solid" size="2" ml="auto" loading={isPending} disabled={isPending}>
            Salvar
          </Button>
        </Flex>
      </form>
    </Flex>
  )
}
