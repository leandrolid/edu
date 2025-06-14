import { Injectable } from '@infra/_injection'
import { prisma } from '@infra/database/connections/prisma.connection'
import type { CreateUserInput, IUserRepository } from '@infra/repositories/user/user.repository'
import type { User } from '@prisma/client'

@Injectable({
  token: 'IUserRepository',
})
export class UserRepository implements IUserRepository {
  async create(input: CreateUserInput): Promise<User> {
    return prisma.user.create({ data: input })
  }

  async findById(id: string): Promise<User | null> {
    return prisma.user.findUnique({ where: { id } })
  }

  async findByEmail(email: string): Promise<User | null> {
    return prisma.user.findUnique({ where: { email } })
  }
}
