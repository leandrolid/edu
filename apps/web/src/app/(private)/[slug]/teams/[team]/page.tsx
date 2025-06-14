import { createTeamAction } from '@/app/(private)/[slug]/teams/new/actions'
import { TeamForm } from '@/components/teams/team-form'
import { Card, Flex, Heading, Inset } from '@radix-ui/themes'

export default async function EditTeamPage() {
  return (
    <Flex direction="column" gap="4">
      <Card variant="surface" style={{ width: '100%' }}>
        <Inset side="all" p="0">
          <Flex direction="column" gap="3" p="4">
            <Heading as="h5" size="4">
              Editar time
            </Heading>

            <TeamForm action={createTeamAction} />
          </Flex>
        </Inset>
      </Card>
    </Flex>
  )
}
