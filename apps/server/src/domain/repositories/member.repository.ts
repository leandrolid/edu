import { Member } from '@prisma/client'

export interface IMemberRepository {
  findMembers(params: FindMembersInput): Promise<Member[]>
}

export type FindMembersInput = {
  organizationId: string
  search?: string
  page: number
  limit: number
}
