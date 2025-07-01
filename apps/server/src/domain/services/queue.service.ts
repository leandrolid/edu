export interface IQueueService<T> {
  add(name: string, data: T): Promise<void>
  addMany(jobs: AddManyInput<T>): Promise<void>
  close(): Promise<void>
}

export type AddManyInput<T> = Array<{ name: string; data: T }>

export interface IJobService<T> {
  process(job: ProcessInput<T>): void
}

export type ProcessInput<T> = {
  name: string
  data: T
}
