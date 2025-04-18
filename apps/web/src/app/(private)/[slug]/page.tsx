import { Container, Flex, Grid, Skeleton } from '@radix-ui/themes'

export default async function OrganizationPage() {
  return (
    <Container size="4" p="4">
      <Flex direction="column" gap="4">
        <Skeleton style={{ width: '100%', height: '300px' }} />
        <Grid columns="repeat(auto-fill, minmax(30rem, 1fr))" gap="4">
          <Skeleton style={{ width: '100%', height: '200px' }} />
          <Skeleton style={{ width: '100%', height: '200px' }} />
          <Skeleton style={{ width: '100%', height: '200px' }} />
          <Skeleton style={{ width: '100%', height: '200px' }} />
        </Grid>
      </Flex>
    </Container>
  )
}
