import { IUser } from '@domain/dtos/user.dto'
import { UnauthorizedError } from '@domain/errors/unauthorized.error'
import { ITokenService } from '@domain/services/token.service'
import { Inject, Injectable } from '@infra/_injection'
import type { IRequest } from '@infra/http/interfaces/controller'
import { IMiddleware } from '@infra/http/interfaces/middleware'

declare module '@infra/http/interfaces/controller' {
  interface IRequest {
    user?: IUser
  }
}

@Injectable()
export class JwtMiddleware implements IMiddleware {
  constructor(@Inject('ITokenService') private readonly tokenService: ITokenService) {}

  async execute(request: IRequest<any, any, any, Record<string, string>>) {
    if (!request.headers.authorization) throw new UnauthorizedError('Token não fornecido')
    const [bearer, token] = request.headers.authorization.split(' ')
    if (bearer !== 'Bearer') throw new UnauthorizedError('Token mal formatado')
    if (!token) throw new UnauthorizedError('Token mal formatado')
    const payload = await this.tokenService.verify<{ id: string }>(token)
    request.user = {
      id: payload.id,
    }
  }
}
