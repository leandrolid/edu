import { CreateAccountInput } from '@app/users/create-account/create-account.input'
import { BadRequestError } from '@domain/errors/bad-request.error'
import { Injectable } from '@infra/_injection'
import { prisma } from '@infra/database/connections/prisma.connection'
import { hash } from 'bcrypt'

@Injectable()
export class CreateAccountUseCase {
  async execute({ name, email, password }: CreateAccountInput) {
    const userExists = await prisma.user.findUnique({ where: { email } })
    if (userExists) {
      throw new BadRequestError('Usuário já existe')
    }
    const newUser = await prisma.user.create({
      data: { name, email, passwordHash: await hash(password, 10) },
    })
    return {
      id: newUser.id,
    }
  }
}
