import { Card, Flex, Heading, Inset } from '@radix-ui/themes'

export default async function AdminPage(props: {
  searchParams?: Promise<{
    search?: string
    page?: string
  }>
}) {
  const searchParams = await props.searchParams
  const page = Number(searchParams?.page) || 1
  const search = searchParams?.search || ''
  return (
    <Flex direction="column" gap="4">
      <Card variant="surface" style={{ width: '100%' }}>
        <Inset side="all" p="0">
          <Heading>Hello from teams</Heading>
        </Inset>
      </Card>
    </Flex>
  )
}
