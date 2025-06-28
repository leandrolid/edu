import type {
  FindManyOptions,
  FindOneOptions,
  IRepository,
  UpdateOneOptions,
} from '@domain/persistence/repository'
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

  async findUnique(filters: FindOneOptions<T>): Promise<T | null> {
    const result = await this.connection.query(this.modelName, 'findUnique', {
      where: filters.where as any,
      select: filters.select,
    })
    return result as T | null
  }

  async findMany(where: FindManyOptions<T>): Promise<T[]> {
    const result = await this.connection.query(this.modelName, 'findMany', {
      where: where.where as any,
      take: where.take,
      skip: where.skip,
      orderBy: where.orderBy,
    })
    return result as T[]
  }

  async count(where: FindManyOptions<T>): Promise<number> {
    const result = await this.connection.query(this.modelName, 'count', {
      where: where.where as any,
    })
    return result as number
  }

  async updateOne(filters: UpdateOneOptions<T>): Promise<T> {
    const result = await this.connection.query(this.modelName, 'update', {
      where: { id: filters.id },
      data: filters.data,
    })
    return result as T
  }

  async deleteById(id: string): Promise<void> {
    await this.connection.query(this.modelName, 'delete', {
      where: { id },
    })
  }
}
