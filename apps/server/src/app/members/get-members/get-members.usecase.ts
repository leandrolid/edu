import { GetMembersInput } from '@app/members/get-members/get-members.input'
import { Auth } from '@domain/dtos/auth.dto'
import { ForbiddenError } from '@domain/errors/forbidden.error'
import type { IMemberRepository } from '@domain/repositories/member.repository'
import type { IPermissionService } from '@domain/services/permission.service'
import { Inject, Injectable } from '@infra/_injection'

@Injectable()
export class GetMembersUseCase {
  constructor(
    @Inject('IPermissionService') private readonly permissionService: IPermissionService,
    @Inject('IMemberRepository') private readonly memberRepository: IMemberRepository,
  ) {}

  async execute({ teamId, search, page, limit = 10, user }: Auth<GetMembersInput>) {
    const { cannot } = await this.permissionService.defineAbilityFor(user)
    const rbacMember = this.permissionService.getMember(user)
    if (cannot('read', rbacMember)) {
      throw new ForbiddenError('Você não tem permissão para ver os membros dessa organização')
    }
    const { members, count } = await this.memberRepository.findMembersAndCount({
      organizationId: user.organizationId!,
      teamId,
      search,
      page,
      limit,
    })
    return {
      metadata: {
        page,
        pageSize: limit,
        total: count,
        totalPages: Math.ceil(count / limit),
      },
      members: members.map(({ user, ...member }) => ({
        ...member,
        name: user.name,
        email: user.email,
      })),
    }
  }
}
