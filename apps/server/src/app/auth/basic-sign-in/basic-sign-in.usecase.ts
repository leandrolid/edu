import { BasicSignInInput } from '@app/auth/basic-sign-in/basic-sign-in.input'
import { BadRequestError } from '@domain/errors/bad-request.error'
import { ForbiddenError } from '@domain/errors/forbidden.error'
import { Inject, Injectable } from '@infra/_injection'
import { prisma } from '@infra/database/connections/prisma.connection'
import type { ITokenService } from '@infra/services/token/token.service'
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
    const token = await this.tokenService.sign({ id: user.id }, { expiresIn: '7d' })
    return { token }
  }
}
