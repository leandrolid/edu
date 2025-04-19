import {
  FindMembersAndCountOutput,
  FindMembersAndCountInput,
  IMemberRepository,
} from '@infra/repositories/member/member.repository'
import { Injectable } from '@infra/_injection'
import { prisma } from '@infra/database/connections/prisma.connection'
import { Prisma } from '@prisma/client'

@Injectable({
  token: 'IMemberRepository',
})
export class MemberRepository implements IMemberRepository {
  async findMembersAndCount(input: FindMembersAndCountInput): Promise<FindMembersAndCountOutput> {
    const where: Prisma.MemberFindManyArgs['where'] = {
      organizationId: input.organizationId,
      user: {
        ...(input.search && {
          OR: [
            { name: { contains: input.search, mode: 'insensitive' } },
            { email: { contains: input.search, mode: 'insensitive' } },
          ],
        }),
      },
    }
    const [members, count] = await prisma.$transaction([
      prisma.member.findMany({
        where,
        include: { user: { select: { name: true, email: true } } },
        skip: (input.page - 1) * input.limit,
        take: input.limit,
      }),
      prisma.member.count({ where }),
    ])
    return { members, count }
  }
}
