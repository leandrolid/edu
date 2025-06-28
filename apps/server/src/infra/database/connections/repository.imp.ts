import type { IRepository } from '@domain/persistence/repository'
import { PrismaDatabaseConnection } from '@infra/database/connections/connection.imp'
import type { Prisma } from '@prisma/client'

export class Repository<T> implements IRepository<T> {
  constructor(
    private readonly connection: PrismaDatabaseConnection,
    private readonly modelName: Prisma.ModelName,
  ) {}

  async createOne(data: Partial<T>): Promise<T> {
    const result = await this.connection.query(this.modelName, 'create', {
      data,
    })
    return result as T
  }

  async findById(id: string): Promise<T | null> {
    const result = await this.connection.query(this.modelName, 'findUnique', {
      where: { id },
    })
    return result as T | null
  }

  async findUnique(where: Partial<T>): Promise<T | null> {
    const result = await this.connection.query(this.modelName, 'findUnique', {
      where: where as any,
    })
    return result as T | null
  }

  async findMany(
    where: Partial<T>,
    options?: {
      take?: number
      skip?: number
      orderBy?: Record<keyof T, 'asc' | 'desc'> | undefined
    },
  ): Promise<T[]> {
    throw new Error('Method not implemented.')
  }
}
