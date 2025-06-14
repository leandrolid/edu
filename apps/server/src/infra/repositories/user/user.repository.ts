import type { User } from '@prisma/client'

export interface IUserRepository {
  create(input: CreateUserInput): Promise<User>
  findById(id: string): Promise<User | null>
  findByEmail(email: string): Promise<User | null>
}

export type CreateUserInput = {
  name: string
  email: string
  passwordHash: string
}
