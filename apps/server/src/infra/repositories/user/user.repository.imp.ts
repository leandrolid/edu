import type { IRepository } from '@domain/persistence/repository'
import { Injectable } from '@edu/framework'
import { InjectRepository } from '@infra/decorators/inject-repository.decorator'
import type { CreateUserInput, IUserRepository } from '@infra/repositories/user/user.repository'
import type { User } from '@prisma/client'

@Injectable({
  token: 'IUserRepository',
})
export class UserRepository implements IUserRepository {
  constructor(
    @InjectRepository('User')
    private readonly repository: IRepository<User>,
  ) {}

  async createOne(input: CreateUserInput): Promise<User> {
    return this.repository.createOne(input)
  }

  async findById(id: string): Promise<User | null> {
    return this.repository.findById(id)
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.repository.findUnique({ where: { email } })
  }
}
