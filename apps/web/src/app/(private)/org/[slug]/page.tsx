import { Container, Grid, Skeleton } from '@radix-ui/themes'

export default async function OrganizationPage() {
  return (
    <Container size="4" p="4">
      <Grid columns="1" rows="300px 100px" gap="4">
        <Skeleton style={{ width: '100%', height: '100%' }} />
        <Skeleton style={{ width: '100%', height: '100%' }} />
        <Skeleton style={{ width: '100%', height: '100%' }} />
      </Grid>
    </Container>
  )
}
