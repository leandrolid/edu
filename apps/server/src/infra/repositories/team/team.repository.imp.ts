import type { Filter } from '@domain/persistence/filter'
import type { IRepository } from '@domain/persistence/repository'
import { Injectable, NotFoundError } from '@edu/framework'
import { InjectRepository } from '@infra/database/decorators/inject-repository'
import type {
  CreateTeamInput,
  FindManyTeamsAndCountInput,
  FindManyTeamsAndCountOutput,
  GetBySlugInput,
  ITeamRepository,
  UpdateTeamByIdInput,
} from '@infra/repositories/team/team.repository'
import type { Team } from '@prisma/client'

@Injectable({
  token: 'ITeamRepository',
})
export class TeamRepository implements ITeamRepository {
  constructor(
    @InjectRepository('Team')
    private readonly repository: IRepository<Team>,
  ) {}

  async createOne(input: CreateTeamInput): Promise<Team> {
    return this.repository.createOne(input)
  }

  async findById(teamId: string): Promise<Team | null> {
    return this.repository.findById(teamId)
  }

  async findOneBySlugOrFail(input: GetBySlugInput): Promise<Team> {
    const team = await this.repository.findUnique({ where: input })
    if (!team) throw new NotFoundError('Time não encontrado')
    return team
  }

  async findManyAndCount({
    page,
    pageSize,
    organizationId,
    search,
  }: FindManyTeamsAndCountInput): Promise<FindManyTeamsAndCountOutput> {
    const where: Filter<Team> = {
      organizationId: organizationId,
      ...(search && {
        or: [{ name: { ilike: search } }, { slug: { ilike: search } }],
      }),
    }
    const [count, teams] = await Promise.all([
      this.repository.count({ where }),
      this.repository.findMany({
        where,
        take: pageSize,
        skip: (page - 1) * pageSize,
      }),
    ])
    return { teams, count }
  }

  async updateById({ teamId, ...input }: UpdateTeamByIdInput): Promise<Team> {
    return this.repository.updateOne({ id: teamId, data: input })
  }

  async deleteById(teamId: string): Promise<void> {
    await this.repository.deleteById(teamId)
  }
}
