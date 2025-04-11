import { OrganizationForm } from '@/components/organizations/organization-form'
import { Card, Container, Flex, Heading, Inset } from '@radix-ui/themes'

export default function NewOrgPage() {
  return (
    <Container size="4" p="4">
      <Card>
        <Inset side="all" p="0">
          <Flex px="6" pt="6">
            <Heading as="h6" size="4">
              Criar nova organização
            </Heading>
          </Flex>
          <OrganizationForm />
        </Inset>
      </Card>
    </Container>
  )
}
