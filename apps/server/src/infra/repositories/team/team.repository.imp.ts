import { NotFoundError } from '@domain/errors/not-found.error'
import { Injectable } from '@infra/_injection'
import { prisma } from '@infra/database/connections/prisma.connection'
import type {
  CreateTeamInput,
  FindManyAndCountInput,
  FindManyAndCountOutput,
  GetBySlugInput,
  ITeamRepository,
} from '@infra/repositories/team/team.repository'
import type { Prisma, Team } from '@prisma/client'

@Injectable({
  token: 'ITeamRepository',
})
export class TeamRepository implements ITeamRepository {
  async createOne(input: CreateTeamInput): Promise<Team> {
    return prisma.team.create({ data: input })
  }

  async findOneBySlugOrFail(input: GetBySlugInput): Promise<Team> {
    const team = await prisma.team.findUnique({
      where: { slug_organizationId: input },
    })
    if (!team) throw new NotFoundError('Time não encontrado')
    return team
  }

  async findManyAndCount({
    page,
    pageSize,
    organizationId,
    search,
  }: FindManyAndCountInput): Promise<FindManyAndCountOutput> {
    const where: Prisma.TeamFindManyArgs['where'] = {
      organizationId: organizationId,
      ...(search && {
        OR: [
          { name: { contains: search, mode: 'insensitive' } },
          { slug: { equals: search, mode: 'insensitive' } },
        ],
      }),
    }
    const [count, teams] = await prisma.$transaction([
      prisma.team.count({ where }),
      prisma.team.findMany({
        where,
        take: pageSize,
        skip: (page - 1) * pageSize,
      }),
    ])
    return { teams, count }
  }

  async deleteById(teamId: string): Promise<void> {
    await prisma.team.delete({ where: { id: teamId } })
  }
}
