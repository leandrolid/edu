import { ContentsMetrics } from '@/components/contents/contents-metrics'
import { AreaChart } from '@/components/organizations/area-chart'
import { VerticalBar } from '@/components/organizations/bar-chart'
import { Container, Flex, Grid } from '@radix-ui/themes'

export default async function OrganizationPage() {
  return (
    <Container size="4" p="4">
      <Flex direction="column" gap="4">
        <ContentsMetrics />
        <Grid columns="repeat(auto-fill, minmax(30rem, 1fr))" gap="4">
          <AreaChart />
          <VerticalBar />
        </Grid>
      </Flex>
    </Container>
  )
}
