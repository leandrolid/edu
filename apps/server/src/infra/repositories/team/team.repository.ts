import type { Role, Team } from '@prisma/client'

export interface ITeamRepository {
  createOne(input: CreateTeamInput): Promise<Team>
  findOneBySlugOrFail(input: GetBySlugInput): Promise<Team>
  findManyAndCount(input: FindManyAndCountInput): Promise<FindManyAndCountOutput>
  deleteById(teamId: string): Promise<void>
}

export type CreateTeamInput = {
  name: string
  description: string
  slug: string
  organizationId: string
  roles: Role[]
  ownerId: string
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
