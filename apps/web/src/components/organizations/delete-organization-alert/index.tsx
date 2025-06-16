import { Warning } from '@phosphor-icons/react'
import { AlertDialog, Button, Flex, Inset, Separator, Strong } from '@radix-ui/themes'

type Props = {
  children?: React.ReactNode
  onConfirm: () => void
}

export function DeleteOrganizationAlert({ children, onConfirm }: Props) {
  return (
    <AlertDialog.Root>
      <AlertDialog.Trigger>{children}</AlertDialog.Trigger>
      <AlertDialog.Content asChild>
        <Flex direction="column" gap="4">
          <Inset side="top">
            <Separator
              orientation="horizontal"
              decorative
              color="red"
              size="4"
              style={{ height: '4px' }}
            />
          </Inset>
          <Flex asChild align="center" gap="2">
            <AlertDialog.Title style={{ margin: 0 }}>
              <Warning weight="fill" color="var(--red-9)" />
              Excluir organização
            </AlertDialog.Title>
          </Flex>
          <Separator orientation="horizontal" size="4" />
          <AlertDialog.Description>
            Esta ação não pode ser desfeita. Todos os dados da organização serão excluídos
            permanentemente. Você não poderá recuperar os dados após a exclusão.
            <br />
            <Strong>Tem certeza de que deseja continuar?</Strong>
          </AlertDialog.Description>
          <Flex direction={{ initial: 'column', sm: 'row' }} justify="end" gap="2">
            <AlertDialog.Cancel>
              <Button variant="outline" color="gray">
                Cancelar
              </Button>
            </AlertDialog.Cancel>
            <AlertDialog.Action>
              <Button variant="soft" color="red" onClick={onConfirm}>
                Sim, excluir organização
              </Button>
            </AlertDialog.Action>
          </Flex>
        </Flex>
      </AlertDialog.Content>
    </AlertDialog.Root>
  )
}
