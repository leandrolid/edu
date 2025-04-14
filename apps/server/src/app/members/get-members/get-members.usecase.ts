import { GetMembersInput } from '@app/members/get-members/get-members.input'
import { Auth } from '@domain/dtos/auth.dto'
import { ForbiddenError } from '@domain/errors/forbidden.error'
import type { IMemberRepository } from '@domain/repositories/member.repository'
import type { IOrganizationRepository } from '@domain/repositories/organization.repository'
import type { IPermissionService } from '@domain/services/permission.service'
import { Inject, Injectable } from '@infra/_injection'

@Injectable()
export class GetMembersUseCase {
  constructor(
    @Inject('IPermissionService') private readonly permissionService: IPermissionService,
    @Inject('IOrganizationRepository')
    private readonly organizationRepository: IOrganizationRepository,
    @Inject('IMemberRepository')
    private readonly memberRepository: IMemberRepository,
  ) {}

  async execute({ slug, search, page, limit = 10, user }: Auth<GetMembersInput>) {
    const organization = await this.organizationRepository.getBySlug(slug)
    const { cannot } = await this.permissionService.defineAbilityFor(user)
    if (cannot('read', 'Member')) {
      throw new ForbiddenError('Você não tem permissão para ver os membros dessa organização')
    }
    const members = await this.memberRepository.findMembers({
      organizationId: organization.id,
      search,
      page,
      limit,
    })
    return {
      members,
    }
  }
}
