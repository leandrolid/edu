import { ContentsMetrics } from '@/components/contents/contents-metrics'
import { Card, Flex, Heading, Inset } from '@radix-ui/themes'

export default async function ContentsPage() {
  return (
    <>
      <Card style={{ width: '100%' }}>
        <Inset side="all" p="0">
          <Flex direction="column" gap="2" p="6">
            <Heading as="h6" size="4">
              Conteúdos
            </Heading>

            <ContentsMetrics />
          </Flex>
        </Inset>
      </Card>
    </>
  )
}
