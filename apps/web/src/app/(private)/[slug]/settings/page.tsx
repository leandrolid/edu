import { OrganizationForm } from '@/components/organizations/organization-form'
import { auth } from '@/auth'
import { getOrganization } from '@/http/services/organizations/get-organization'
import { Card, Flex, Heading, Inset } from '@radix-ui/themes'

export default async function SettingsPage() {
  const org = await auth.getCurrentOrganization()
  const { data: organization } = await getOrganization(org!)
  return (
    <>
      <Card variant="surface" style={{ width: '100%' }}>
        <Inset side="all" p="0">
          <Flex px="6" pt="6">
            <Heading as="h6" size="4">
              Configurações básicas
            </Heading>
          </Flex>
          <OrganizationForm isUpdating organization={organization} />
        </Inset>
      </Card>
    </>
  )
}
