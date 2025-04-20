'use client'

import { PERMISSIONS_DESCRIPTION } from '@edu/utils'
import { Button, CheckboxCards, Flex, Separator, Strong, Text, TextField } from '@radix-ui/themes'
import styles from './styles.module.css'

export function TeamForm() {
  return (
    <Flex direction="column" gap="4" asChild>
      <form action="">
        <Flex direction="column" gap="1">
          <Text as="label" size="2" weight="bold" htmlFor="name">
            Nome:
          </Text>
          <TextField.Root name="name" id="name" />
        </Flex>

        <Flex direction="column" gap="1">
          <Text as="label" size="2" weight="bold" htmlFor="description">
            Descrição (opcional):
          </Text>
          <TextField.Root name="description" id="description" />
        </Flex>

        <Text size="2" color="gray">
          Selecione as permissões que deseja conceder a este time:
        </Text>
        <CheckboxCards.Root columns={{ initial: '1', sm: '2' }} gap="4">
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
          <Flex direction="column" gap="1"></Flex>
        </CheckboxCards.Root>

        <Separator orientation="horizontal" decorative size="4" />

        <Flex align="center" justify="between" gap="4">
          <Text size="1" color="gray">
            Você pode editar as permissões depois
          </Text>
          <Button>Salvar</Button>
        </Flex>
      </form>
    </Flex>
  )
}
