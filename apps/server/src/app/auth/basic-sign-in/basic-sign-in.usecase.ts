import { BasicSignInInput } from '@app/auth/basic-sign-in/basic-sign-in.input'
import { BadRequestError } from '@domain/errors/bad-request.error'
import { ForbiddenError } from '@domain/errors/forbidden.error'
import { Inject, Injectable } from '@infra/_injection'
import type { IUserRepository } from '@infra/repositories/user/user.repository'
import type { ITokenService } from '@infra/services/token/token.service'
import { compare } from 'bcrypt'

@Injectable()
export class BasicSignInUseCase {
  constructor(
    @Inject('IUserRepository') private readonly userRepository: IUserRepository,
    @Inject('ITokenService') private readonly tokenService: ITokenService,
  ) {}

  async execute({ email, password }: BasicSignInInput) {
    const user = await this.userRepository.findByEmail(email)
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
