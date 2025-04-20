import { Role } from '@prisma/client'

export interface IMemberRepository {
  findAndCount(params: FindAndCountInput): Promise<FindAndCountOutput>
}

export type FindAndCountInput = {
  organizationId: string
  team: string
  search?: string
  page: number
  pageSize: number
}

export type FindAndCountOutput = {
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
