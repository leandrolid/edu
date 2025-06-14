import { auth } from '@/auth'
import { Pagination } from '@/components/pagination'
import { TeamActions } from '@/components/teams/team-actions'
import { getTeams } from '@/http/services/teams/get-teams'
import { errorBoundary, PERMISSIONS_DESCRIPTION } from '@edu/utils'
import { Flex, Table, Text } from '@radix-ui/themes'
import { redirect } from 'next/navigation'

export async function TeamsList({ page, search }: { search: string; page: number }) {
  const slug = await auth.getCurrentOrganization()
  const { data: teams, metadata } = await errorBoundary({
    input: { slug: slug!, page: 1, pageSize: 10, search },
    request: getTeams,
    onError: () => redirect('/'),
  })

  return (
    <>
      <Table.Root variant="surface" style={{ borderRadius: 0 }}>
        <Table.Body>
          {teams.map((team) => (
            <Table.Row key={team.id} align="center">
              <Table.Cell justify="start">
                <Flex direction="column" align="start" gap="1">
                  <Text size="2" weight="medium" truncate>
                    {team.name}
                  </Text>
                  <Text size="1" color="gray" truncate>
                    {team.slug}
                  </Text>
                </Flex>
              </Table.Cell>
              <Table.Cell>
                <Text size="1" color="gray" truncate>
                  {team.roles
                    .map(
                      (role) =>
                        PERMISSIONS_DESCRIPTION.find((permission) => permission.value === role)
                          ?.name || role,
                    )
                    .join(', ')}
                </Text>
              </Table.Cell>
              <Table.Cell justify="end">
                <TeamActions teamId={team.id} />
              </Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table.Root>
      <Pagination
        page={page}
        totalPages={metadata.totalPages}
        pageSize={metadata.pageSize}
        total={metadata.total}
      />
    </>
  )
}
