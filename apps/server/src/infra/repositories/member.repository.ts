import {
  FindMembersAndCountOutput,
  FindMembersInput,
  FindMembersOutput,
  IMemberRepository,
} from '@domain/repositories/member.repository'
import { Injectable } from '@infra/_injection'
import { prisma } from '@infra/database/connections/prisma.connection'

@Injectable({
  token: 'IMemberRepository',
})
export class MemberRepository implements IMemberRepository {
  async findMembers(input: FindMembersInput): Promise<FindMembersOutput[]> {
    const members = await prisma.member.findMany({
      where: {
        organizationId: input.organizationId,
        teamId: input.teamId,
        user: {
          ...(input.search && {
            OR: [
              { name: { contains: input.search, mode: 'insensitive' } },
              { email: { contains: input.search, mode: 'insensitive' } },
            ],
          }),
        },
      },
      include: {
        user: { select: { name: true, email: true } },
      },
      skip: (input.page - 1) * input.limit,
      take: input.limit,
    })
    return members
  }

  async findMembersAndCount(input: FindMembersInput): Promise<FindMembersAndCountOutput> {
    const members = await this.findMembers(input)
    const count = await prisma.member.count({
      where: {
        organizationId: input.organizationId,
        user: {
          ...(input.search && {
            OR: [
              { name: { contains: input.search, mode: 'insensitive' } },
              { email: { contains: input.search, mode: 'insensitive' } },
            ],
          }),
        },
      },
    })
    return { members, count }
  }
}
