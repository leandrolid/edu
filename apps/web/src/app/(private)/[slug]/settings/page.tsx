import {
  deleteOrganizationAction,
  updateOrganizationAction,
} from '@/app/(private)/[slug]/settings/actions'
import { auth } from '@/auth'
import { DeleteOrganization } from '@/components/organizations/delete-organization'
import { OrganizationForm } from '@/components/organizations/organization-form'
import { getOrganization } from '@/http/services/organizations/get-organization'
import { requestFallback } from '@edu/utils'
import { Button, Card, Flex, Heading, Separator, Text } from '@radix-ui/themes'
import { redirect } from 'next/navigation'

export default async function SettingsPage() {
  const { data: organization } = await requestFallback({
    request: async () => {
      const slug = await auth.getCurrentOrganization()
      return await getOrganization({ slug: slug! })
    },
    onError: () => redirect('/'),
  })

  return (
    <>
      <Card style={{ padding: 0 }}>
        <Flex direction="column" p="6" gap="4">
          <Heading as="h6" size="4">
            Configurações básicas
          </Heading>
          <OrganizationForm
            isUpdating
            organization={organization}
            action={updateOrganizationAction}
          />
        </Flex>
      </Card>

      <Flex direction="column" gap="4">
        <Heading as="h6" size="4">
          Zona de perigo
        </Heading>

        <Flex
          direction="column"
          style={{
            background: 'var(--color-panel)',
            border: '1px solid var(--red-7)',
            borderRadius: 'var(--radius-4)',
            overflow: 'hidden',
          }}
        >
          <Flex direction={{ initial: 'column', xs: 'row' }} align="center" p="6" gap="4">
            <Flex direction="column" gap="1" flexGrow="1">
              <Heading as="h6" size="3">
                Sair da organização
              </Heading>
              <Text as="p" size="2" color="gray">
                Você pode sair da organização a qualquer momento, mas não poderá entrar novamente se
                não for convidado por um membro da organização.
              </Text>
            </Flex>

            <Button variant="outline" color="red" ml="auto" disabled style={{ minWidth: '7rem' }}>
              Sair
            </Button>
          </Flex>

          <Separator orientation="horizontal" size="4" m="0" />

          <Flex direction={{ initial: 'column', xs: 'row' }} align="center" p="6" gap="4">
            <Flex direction="column" gap="1" flexGrow="1">
              <Heading as="h6" size="3">
                Excluir organização
              </Heading>
              <Text as="p" size="2" color="gray">
                Esta ação é irreversível e excluirá todos os dados da organização.
              </Text>
            </Flex>

            <DeleteOrganization action={deleteOrganizationAction} />
          </Flex>
        </Flex>
      </Flex>
    </>
  )
}
