import { OrganizationForm } from '@/app/(private)/org/organization-form'
import { Card, Container } from '@radix-ui/themes'

export default function NewOrgPage() {
  return (
    <Container size="4" p="4">
      <Card>
        <OrganizationForm />
      </Card>
    </Container>
  )
}
