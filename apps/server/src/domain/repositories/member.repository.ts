import { Role } from '@prisma/client'

export interface IMemberRepository {
  findMembers(params: FindMembersInput): Promise<FindMembersOutput[]>
  findMembersAndCount(params: FindMembersInput): Promise<FindMembersAndCountOutput>
}

export type FindMembersInput = {
  organizationId: string
  teamId: string
  search?: string
  page: number
  limit: number
}

export type FindMembersOutput = {
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
}

export type FindMembersAndCountOutput = {
  members: FindMembersOutput[]
  count: number
}
