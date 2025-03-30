import { BasicSignInInput } from '@app/auth/basic-sign-in/basic-sign-in.input'
import { BadRequestError } from '@domain/errors/bad-request.error'
import { ForbiddenError } from '@domain/errors/forbidden.error'
import type { ITokenService } from '@domain/services/token.service'
import { Injectable } from '@infra/_injection'
import { Inject } from '@infra/_injection/inject'
import { prisma } from '@infra/database/connections/prisma.connection'
import { compare } from 'bcrypt'

@Injectable()
export class BasicSignInUseCase {
  constructor(@Inject('ITokenService') private readonly tokenService: ITokenService) {}

  async execute({ email, password }: BasicSignInInput) {
    const user = await prisma.user.findUnique({
      where: { email },
    })
    if (!user) {
      throw new ForbiddenError('Usuário ou senha inválidos')
    }
    if (!user.passwordHash) {
      throw new BadRequestError('Usuário possui autenticação externa')
    }
    const isValidPassword = await compare(password, user.passwordHash)
    if (!isValidPassword) {
      throw new ForbiddenError('Usuário ou senha inválidos')
    }
    const token = await this.tokenService.sign({ id: user.id }, { expiresIn: '1h' })
    return { token }
  }
}
