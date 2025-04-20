import { Role } from '@prisma/client'

export interface IMemberRepository {
  findMembersAndCount(params: FindMembersAndCountInput): Promise<FindMembersAndCountOutput>
}

export type FindMembersAndCountInput = {
  organizationId: string
  teamId: string
  search?: string
  page: number
  pageSize: number
}

export type FindMembersAndCountOutput = {
  members: Array<{
    id: string
    slug: string
    roles: Role[]
    createdAt: Date
    updatedAt: Date
    organizationId: string
    userId: string
    teamId: string
    user: {
      name: string | null
      email: string | null
    }
  }>
  count: number
}
