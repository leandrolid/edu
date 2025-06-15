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
  ) {}

  async execute(request: IRequest<any, any, Record<string, string>, Record<string, string>>) {
    if (!request.headers.authorization) throw new UnauthorizedError('Token não fornecido')
    const [bearer, token] = request.headers.authorization.split(' ')
    if (bearer !== 'Bearer') throw new UnauthorizedError('Token mal formatado')
    if (!token) throw new UnauthorizedError('Token mal formatado')
    const payload = await this.tokenService.verify<{ id: string }>(token)
    if (!request.params.slug) {
      request.user = { id: payload.id }
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
      slug: membership.slug,
      organizationId: membership.organizationId,
      roles: membership.roles,
    }
  }
}
