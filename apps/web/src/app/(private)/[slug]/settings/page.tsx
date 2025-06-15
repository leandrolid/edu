import { auth } from '@/auth'
import { OrganizationForm } from '@/components/organizations/organization-form'
import { getOrganization } from '@/http/services/organizations/get-organization'
import { requestFallback } from '@edu/utils'
import { Card, Flex, Heading, Inset } from '@radix-ui/themes'
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
