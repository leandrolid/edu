import { Injectable } from '@infra/_injection'
import { prisma } from '@infra/database/connections/prisma.connection'
import {
  FindAndCountInput,
  FindAndCountOutput,
  IMemberRepository,
} from '@infra/repositories/member/member.repository'
import { Prisma } from '@prisma/client'

@Injectable({
  token: 'IMemberRepository',
})
export class MemberRepository implements IMemberRepository {
  async findAndCount(input: FindAndCountInput): Promise<FindAndCountOutput> {
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
}
