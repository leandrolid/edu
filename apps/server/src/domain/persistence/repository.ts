export interface IRepository<Entity> {
  createOne(data: Partial<Entity>): Promise<Entity>
  findById(id: string): Promise<Entity | null>
  findUnique(filters: FindOneOptions<Entity>): Promise<Entity | null>
  findMany(filters: FindManyOptions<Entity>): Promise<Entity[]>
  count(filters: FindManyOptions<Entity>): Promise<number>
  updateOne(filters: UpdateOneOptions<Entity>): Promise<Entity>
  deleteById(id: string): Promise<void>
}

export type FindOneOptions<T> = {
  where: Partial<T>
  select?: Partial<{
    [K in keyof T]: boolean
  }>
}

export type FindManyOptions<T> = {
  where: Partial<T>
  take?: number
  skip?: number
  orderBy?: Record<keyof T, 'asc' | 'desc'>
  select?: Partial<{
    [K in keyof T]: boolean
  }>
}

export type UpdateOneOptions<T> = {
  id: string
  data: Partial<T>
}
