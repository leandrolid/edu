import type { IJobService, ProcessInput } from '@domain/services/queue.service'
import { redisConnection } from '@infra/adapters/bull/redis.connection'
import { Worker } from 'bullmq'

export abstract class BullJobAdapter<JobData> implements IJobService<JobData> {
  private readonly worker: Worker<JobData>

  constructor(private readonly queueName: string) {
    this.worker = new Worker<JobData>(
      queueName,
      async (job) => {
        await this.process({
          name: job.name,
          data: job.data,
        })
      },
      {
        connection: redisConnection,
        autorun: true,
        concurrency: 2,
        removeOnComplete: {
          age: 3_600, // Remove completed jobs after 1 hour
          count: 100, // Keep the last 100 completed jobs
        },
      },
    )
    this.worker.on('failed', (job, err) => {
      console.error(`Job failed: ${job?.id}, Error: ${err.message}`)
    })
  }

  abstract process(job: ProcessInput<JobData>): Promise<void>

  async close(): Promise<void> {
    await this.worker?.close()
  }
}
