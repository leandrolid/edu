import type { GetMembersInput } from '@app/members/get-members/get-members.input'
import type { Auth } from '@domain/dtos/auth.dto'
import { ForbiddenError } from '@domain/errors/forbidden.error'
import { Inject, Injectable } from '@infra/_injection'
import type { IMemberRepository } from '@infra/repositories/member/member.repository'
import type { IPermissionService } from '@infra/services/permission/permission.service'

@Injectable()
export class GetMembersUseCase {
  constructor(
    @Inject('IPermissionService') private readonly permissionService: IPermissionService,
    @Inject('IMemberRepository') private readonly memberRepository: IMemberRepository,
  ) {}

  async execute({ team, search, page, pageSize, user }: Auth<GetMembersInput>) {
    const { cannot } = this.permissionService.defineAbilityFor(user)
    const rbacMember = this.permissionService.getMember(user)
    if (cannot('read', rbacMember)) {
      throw new ForbiddenError('Você não tem permissão para ver os membros dessa organização')
    }
    const { members, count } = await this.memberRepository.findAndCount({
      organizationId: user.organizationId!,
      team,
      search,
      page,
      pageSize,
    })
    return {
      metadata: {
        page,
        pageSize: pageSize,
        total: count,
        totalPages: Math.ceil(count / pageSize),
      },
      members: members.map(({ user, ...member }) => ({
        ...member,
        name: user.name,
        email: user.email,
      })),
    }
  }
}
