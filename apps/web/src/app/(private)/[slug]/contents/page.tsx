import { auth } from '@/auth'
import { getOrganization } from '@/http/services/organizations/get-organization'
import { requestFallback } from '@edu/utils'
import { Card, Flex, Heading, Inset, Skeleton } from '@radix-ui/themes'
import { redirect } from 'next/navigation'

export default async function MaterialsPage() {
  const { data: organization } = await requestFallback({
    request: async () => {
      const slug = await auth.getCurrentOrganization()
      return await getOrganization({ slug: slug! })
    },
    onError: () => redirect('/'),
  })

  return (
    <>
      <Card style={{ width: '100%' }}>
        <Inset side="all" p="0">
          <Flex direction="column" gap="2" p="6">
            <Heading as="h6" size="4">
              Conteúdos
            </Heading>

            <Skeleton width="100%" height="30rem" />
          </Flex>
        </Inset>
      </Card>
    </>
  )
}
