import type { Team } from '@prisma/client'

export interface ITeamRepository {
  getBySlug(input: GetBySlugInput): Promise<Team>
  findManyAndCount(input: FindManyAndCountInput): Promise<FindManyAndCountOutput>
}

export type GetBySlugInput = {
  organizationId: string
  slug: string
}

export type FindManyAndCountInput = {
  organizationId: string
  page: number
  pageSize: number
  search?: string
}

export type FindManyAndCountOutput = {
  teams: Team[]
  count: number
}
