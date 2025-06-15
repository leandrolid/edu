import { Warning } from '@phosphor-icons/react/dist/ssr'
import { AlertDialog, Button, Flex, Inset, Separator, Strong } from '@radix-ui/themes'

type Props = {
  onConfirm: () => void
  onCancel: () => void
}

export function UpdatePermissionsAlert({ onCancel, onConfirm }: Props) {
  return (
    <AlertDialog.Root open>
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
              Atualizar permissões
            </AlertDialog.Title>
          </Flex>
          <Separator orientation="horizontal" size="4" />
          <AlertDialog.Description>
            As permissões serão atualizadas para todos os usuários deste time. Qualquer permissão
            customizada será perdida.
            <br />
            <Strong>Tem certeza de que deseja continuar?</Strong>
          </AlertDialog.Description>
          <Flex direction={{ initial: 'column', sm: 'row' }} justify="end" gap="2">
            <AlertDialog.Cancel>
              <Button variant="outline" color="gray" onClick={onCancel}>
                Cancelar
              </Button>
            </AlertDialog.Cancel>
            <AlertDialog.Action>
              <Button variant="soft" color="red" onClick={onConfirm}>
                Sim, atualizar permissões
              </Button>
            </AlertDialog.Action>
          </Flex>
        </Flex>
      </AlertDialog.Content>
    </AlertDialog.Root>
  )
}
