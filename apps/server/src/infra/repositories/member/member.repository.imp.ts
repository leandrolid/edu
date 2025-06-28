import type { Member } from '@domain/entities/member.entity'
import type { Filter } from '@domain/persistence/filter'
import type { IRepository } from '@domain/persistence/repository'
import { Injectable } from '@edu/framework'
import { InjectRepository } from '@infra/database/decorators/inject-repository'
import {
  type CreateMemberInput,
  type FindManyMembersAndCountInput,
  type FindManyMembersAndCountOutput,
  type FindMembershipInput,
  type IMemberRepository,
  type UpdatePermissionsByTeamIdInput,
} from '@infra/repositories/member/member.repository'

@Injectable({
  token: 'IMemberRepository',
})
export class MemberRepository implements IMemberRepository {
  constructor(
    @InjectRepository('Member')
    private readonly repository: IRepository<Member>,
  ) {}

  async createOne(input: CreateMemberInput): Promise<Member> {
    return this.repository.createOne(input)
  }

  async findManyAndCount(
    input: FindManyMembersAndCountInput,
  ): Promise<FindManyMembersAndCountOutput> {
    const where: Filter<Member> = {
      organizationId: input.organizationId,
      team: { slug: input.team },
      user: input.search
        ? { or: [{ name: { ilike: input.search } }, { email: { ilike: input.search } }] }
        : undefined,
    }
    const [members, count] = await Promise.all([
      this.repository.findMany({
        where,
        relations: { user: true },
        select: {
          id: true,
          userId: true,
          teamId: true,
          organizationId: true,
          roles: true,
          slug: true,
          createdAt: true,
          updatedAt: true,
          user: {
            name: true,
            email: true,
            avatarUrl: true,
          },
        },
        skip: (input.page - 1) * input.pageSize,
        take: input.pageSize,
      }),
      this.repository.count({ where }),
    ])
    return { members, count }
  }

  async findMembershipBySlug(input: FindMembershipInput): Promise<Member | null> {
    return this.repository.findOne({
      where: {
        slug: input.slug,
        userId: input.userId,
      },
    })
  }

  async findManyByTeamId(teamId: string): Promise<Member[]> {
    return this.repository.findMany({
      where: { teamId },
    })
  }

  async updatePermissionsByTeamId(input: UpdatePermissionsByTeamIdInput): Promise<Member[]> {
    return this.repository.updateMany({
      where: { teamId: input.teamId },
      data: { roles: input.roles },
    })
  }
}
