import { Container, Scope } from '../container'
import { EventsService } from '../utils'
import { EVENT_SERVICE, type IEventsService } from '../utils/events'

Container.instance.register(EVENT_SERVICE, {
  useClass: EventsService,
  scope: Scope.Singleton,
})

const eventsService = Container.instance.resolve<IEventsService>(EVENT_SERVICE)

export function OnEvent(event: string) {
  return (target: any, propertyKey: string, descriptor: any) => {
    const originalMethod = descriptor.value
    eventsService.on(event, async (...args: any[]) => {
      await originalMethod.apply(target, args)
    })
    return descriptor
  }
}
