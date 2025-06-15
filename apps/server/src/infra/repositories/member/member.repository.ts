import { Role, type Member } from '@prisma/client'

export interface IMemberRepository {
  createOne(input: CreateMemberInput): Promise<Member>
  findManyAndCount(params: FindManyMembersAndCountInput): Promise<FindManyMembersAndCountOutput>
  findMembershipBySlug(input: FindMembershipInput): Promise<Member | null>
  findManyByTeamId(teamId: string): Promise<Member[]>
  updatePermissionsByTeamId(input: UpdatePermissionsByTeamIdInput): Promise<Member[]>
}

export type CreateMemberInput = {
  organizationId: string
  userId: string
  roles: Role[]
  slug: string
  teamId: string
}

export type FindManyMembersAndCountInput = {
  organizationId: string
  team: string
  search?: string
  page: number
  pageSize: number
}

export type FindManyMembersAndCountOutput = {
  count: number
  members: Array<
    Member & {
      user: {
        name: string | null
        email: string | null
        avatarUrl: string | null
      }
    }
  >
}

export type FindMembershipInput = {
  slug: string
  userId: string
}

export type UpdatePermissionsByTeamIdInput = {
  teamId: string
  roles: Role[]
}
