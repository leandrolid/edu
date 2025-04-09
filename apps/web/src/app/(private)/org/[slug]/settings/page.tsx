import { SettingsForm } from '@/app/(private)/org/[slug]/settings/settings-form'
import { auth } from '@/auth'
import { getOrganization } from '@/http/services/organizations/get-organization'
import { Card } from '@radix-ui/themes'

export default async function SettingsPage() {
  const org = await auth.getCurrentOrganization()
  const { data: organization } = await getOrganization(org!)
  return (
    <>
      <Card variant="surface" style={{ width: '100%', padding: 0 }}>
        <SettingsForm
          organization={{
            name: organization.name,
            domain: organization.domain,
            autoJoin: organization.shouldAttachUserByDomain,
          }}
        />
      </Card>
    </>
  )
}
