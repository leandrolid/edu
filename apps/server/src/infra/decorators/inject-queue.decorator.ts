import { createDecorator, Scope } from '@edu/framework'
import { BullQueueAdapter } from '@infra/adapters/bull/queue.adapter'

export function InjectQueue(queueName: string) {
  return createDecorator(`QueueService<${queueName}>`, {
    scope: Scope.Singleton,
    useValue: new BullQueueAdapter(queueName),
  })
}
