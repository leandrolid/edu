import { Role } from '@prisma/client'

export interface IMemberRepository {
  findMembers(params: FindMembersInput): Promise<FindMembersOutput[]>
}

export type FindMembersInput = {
  organizationId: string
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
