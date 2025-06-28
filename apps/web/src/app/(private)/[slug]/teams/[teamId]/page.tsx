import { updateTeamAction } from '@/app/(private)/[slug]/teams/[teamId]/actions'
import { TeamForm } from '@/components/teams/team-form'
import { getTeam } from '@/http/services/teams/get-team'
import { requestFallback } from '@edu/utils'
import { Card, Flex, Heading, Inset } from '@radix-ui/themes'
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
    <Flex direction="column" gap="4">
      <Card variant="surface" style={{ width: '100%' }}>
        <Inset side="all" p="0">
          <Flex direction="column" gap="3" p="4">
            <Heading as="h5" size="4">
              Editar time
            </Heading>

            <TeamForm team={team} isUpdating action={updateTeamAction} />
          </Flex>
        </Inset>
      </Card>
    </Flex>
  )
}
