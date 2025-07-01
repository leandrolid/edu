import type { IQueueService } from '@domain/services/queue.service'
import { redisConnection } from '@infra/adapters/bull/redis.connection'
import { Queue } from 'bullmq'

export class BullQueueAdapter<T> implements IQueueService<T> {
  private readonly queue: Queue
  constructor(name: string) {
    this.queue = new Queue(name, {
      connection: redisConnection,
      defaultJobOptions: {
        removeOnComplete: true,
        removeOnFail: true,
      },
    })
  }

  async add(name: string, data: T): Promise<void> {
    await this.queue.add(name, data)
  }

  async addMany(jobs: Array<{ name: string; data: T }>): Promise<void> {
    await this.queue.addBulk(jobs)
  }

  async close(): Promise<void> {
    await this.queue.close()
  }
}
