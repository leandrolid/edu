import { updateTeamAction } from '@/app/(private)/[slug]/teams/[teamId]/actions'
import { TeamForm } from '@/components/teams/team-form'
import { getTeam } from '@/http/services/teams/get-team'
import { requestFallback } from '@edu/utils'
import { Card, Flex, Heading } from '@radix-ui/themes'
import { redirect } from 'next/navigation'

export default async function EditTeamPage({
  params,
}: {
  params: Promise<{ slug: string; teamId: string }>
}) {
  const { slug, teamId } = await params
  const { data: team } = await requestFallback({
    request: () => getTeam({ teamId, slug }),
    onError: () => redirect(`/${slug}/teams`),
  })
  return (
    <Card style={{ width: '100%', padding: 0 }}>
      <Flex direction="column" gap="4" p="6">
        <Heading as="h5" size="4">
          Editar time
        </Heading>

        <TeamForm team={team} isUpdating action={updateTeamAction} />
      </Flex>
    </Card>
  )
}
