export interface IRepository<T> {
  createOne(values: Partial<T>): Promise<T>
  findById(id: string): Promise<T | null>
  findUnique(where: Partial<T>): Promise<T | null>
  // findMany(
  //   where: Partial<T>,
  //   options?: {
  //     take?: number
  //     skip?: number
  //     orderBy?: Record<keyof T, 'asc' | 'desc'>
  //   },
  // ): Promise<T[]>
  // count(where: Partial<T>): Promise<number>
  // update(where: Partial<T>, data: Partial<T>): Promise<T[]>
  // delete(where: Partial<T>): Promise<void>
}
