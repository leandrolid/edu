import {
  deleteOrganizationAction,
  updateOrganizationAction,
} from '@/app/(private)/[slug]/settings/actions'
import { auth } from '@/auth'
import { DeleteOrganizationForm } from '@/components/organizations/delete-organization-form'
import { OrganizationForm } from '@/components/organizations/organization-form'
import { getOrganization } from '@/http/services/organizations/get-organization'
import { requestFallback } from '@edu/utils'
import { Button, Card, Flex, Heading, Inset, Separator, Text } from '@radix-ui/themes'
import { redirect } from 'next/navigation'

export default async function SettingsPage() {
  const { data: organization } = await requestFallback({
    request: async () => {
      const slug = await auth.getCurrentOrganization()
      return await getOrganization(slug!)
    },
    onError: () => redirect('/'),
  })
  return (
    <>
      <Card style={{ width: '100%' }}>
        <Inset side="all" p="0">
          <Flex px="6" pt="6">
            <Heading as="h6" size="4">
              Configurações básicas
            </Heading>
          </Flex>
          <OrganizationForm
            isUpdating
            organization={organization}
            action={updateOrganizationAction}
          />
        </Inset>
      </Card>

      <Card style={{ width: '100%' }}>
        <Inset side="all" p="0">
          <Flex direction="column" p="6" gap="4">
            <Heading as="h6" size="4">
              Sair da organização
            </Heading>
            <Text as="p" size="2" color="gray">
              Você pode sair da organização a qualquer momento, mas não poderá entrar novamente se
              não for convidado por um membro da organização.
            </Text>
          </Flex>
          <Separator orientation="horizontal" size="4" m="0" />
          <Flex direction={{ initial: 'column', xs: 'row' }} p="5" gap="4">
            <Button variant="outline" color="red" ml="auto" disabled>
              Sair
            </Button>
          </Flex>
        </Inset>
      </Card>

      <Card style={{ width: '100%' }}>
        <Inset side="all" p="0">
          <Flex direction="column" p="6" gap="4">
            <Heading as="h6" size="4">
              Excluir organização
            </Heading>
            <Text as="p" size="2" color="gray">
              Esta ação é irreversível e excluirá todos os dados da organização.
            </Text>
          </Flex>

          <Separator orientation="horizontal" size="4" m="0" />
          <DeleteOrganizationForm action={deleteOrganizationAction} />
        </Inset>
      </Card>
    </>
  )
}
