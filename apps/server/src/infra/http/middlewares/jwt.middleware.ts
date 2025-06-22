import type { IUser } from '@domain/dtos/user.dto'
import {
  ForbiddenError,
  Inject,
  Injectable,
  UnauthorizedError,
  type IMiddleware,
  type IRequest,
} from '@edu/framework'
import type { IMemberRepository } from '@infra/repositories/member/member.repository'
import type { IOrganizationRepository } from '@infra/repositories/organization/organization.repository'
import type { ITokenService } from '@infra/services/token/token.service'

declare module '@edu/framework' {
  interface IRequest {
    user?: IUser
  }
}

@Injectable()
export class JwtMiddleware implements IMiddleware {
  constructor(
    @Inject('ITokenService') private readonly tokenService: ITokenService,
    @Inject('IMemberRepository') private readonly memberRepository: IMemberRepository,
    @Inject('IOrganizationRepository')
    private readonly organizationRepository: IOrganizationRepository,
  ) {}

  async execute(request: IRequest<any, any, Record<string, string>, Record<string, string>>) {
    const token = this.getTokenOrFail(request.headers)
    const payload = await this.tokenService.verify<{ id: string; owner: boolean }>(token)
    if (!request.params.slug) {
      request.user = { id: payload.id, owner: payload.owner }
      return
    }
    if (payload.owner) {
      const org = await this.organizationRepository.findOneBySlugOrFail(request.params.slug)
      request.user = {
        id: payload.id,
        owner: payload.owner,
        slug: org.slug,
        organizationId: org.id,
      }
      return
    }
    const membership = await this.memberRepository.findMembershipBySlug({
      slug: request.params.slug,
      userId: payload.id,
    })
    if (!membership) {
      throw new ForbiddenError('Você não tem permissão para acessar essa organização')
    }
    request.user = {
      id: payload.id,
      owner: payload.owner,
      slug: membership.slug,
      organizationId: membership.organizationId,
      roles: membership.roles,
    }
  }

  private getTokenOrFail(headers: Record<string, string>) {
    if (!headers.authorization) throw new UnauthorizedError('Token não fornecido')
    const [bearer, token] = headers.authorization.split(' ')
    if (bearer !== 'Bearer') throw new UnauthorizedError('Token mal formatado')
    if (!token) throw new UnauthorizedError('Token mal formatado')
    return token
  }
}
