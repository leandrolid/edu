import { Injectable } from '@infra/_injection'
import { prisma } from '@infra/database/connections/prisma.connection'
import {
  FindManyAndCountInput,
  FindManyAndCountOutput,
  IMemberRepository,
  type CreateMemberInput,
  type FindMembershipInput,
} from '@infra/repositories/member/member.repository'
import { Prisma, type Member } from '@prisma/client'

@Injectable({
  token: 'IMemberRepository',
})
export class MemberRepository implements IMemberRepository {
  async createOne(input: CreateMemberInput): Promise<Member> {
    return prisma.member.create({ data: input })
  }

  async findManyAndCount(input: FindManyAndCountInput): Promise<FindManyAndCountOutput> {
    const where: Prisma.MemberFindManyArgs['where'] = {
      organizationId: input.organizationId,
      team: { slug: input.team },
      user: input.search
        ? {
            OR: [
              { name: { contains: input.search, mode: 'insensitive' } },
              { email: { contains: input.search, mode: 'insensitive' } },
            ],
          }
        : undefined,
    }
    const [members, count] = await prisma.$transaction([
      prisma.member.findMany({
        where,
        include: { user: { select: { name: true, email: true, avatarUrl: true } } },
        skip: (input.page - 1) * input.pageSize,
        take: input.pageSize,
      }),
      prisma.member.count({ where }),
    ])
    return { members, count }
  }

  async findMembershipBySlug(input: FindMembershipInput): Promise<Member | null> {
    return prisma.member.findFirst({
      where: {
        slug: input.slug,
        userId: input.userId,
      },
    })
  }

  async findManyByTeamId(teamId: string): Promise<Member[]> {
    return prisma.member.findMany({
      where: { teamId },
    })
  }
}
