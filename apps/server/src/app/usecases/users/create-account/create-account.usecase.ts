import { CreateAccountInput } from '@app/usecases/users/create-account/create-account.input'
import { BadRequestError, Inject, Injectable } from '@edu/framework'
import type { IUserRepository } from '@infra/repositories/user/user.repository'
import { hash } from 'bcrypt'

@Injectable()
export class CreateAccountUseCase {
  constructor(@Inject('IUserRepository') private readonly userRepository: IUserRepository) {}

  async execute({ name, email, password }: CreateAccountInput) {
    const userExists = await this.userRepository.findByEmail(email)
    if (userExists) {
      throw new BadRequestError('Usuário já existe')
    }
    const newUser = await this.userRepository.create({
      name,
      email,
      passwordHash: await hash(password, 10),
    })
    return {
      id: newUser.id,
    }
  }
}
