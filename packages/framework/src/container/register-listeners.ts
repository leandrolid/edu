import { Container } from '.'
import type { Listener } from '../decorators'
import type { Provider } from '../interfaces'
import { EVENT_SERVICE, type IEventsService } from '../utils'

export function registerListeners(providers?: Provider[]): void {
  if (!providers || !Array.isArray(providers)) return
  providers.forEach((provider) => {
    const classDefinition = 'useClass' in provider ? provider.useClass : provider
    const isListener = Reflect.hasMetadata('custom:listeners', classDefinition)
    if (!isListener) return
    const eventsService = Container.instance.resolve<IEventsService>(EVENT_SERVICE)
    if (!eventsService) throw new Error(`${EVENT_SERVICE} not found`)
    const token = 'provide' in provider ? provider.provide : classDefinition
    const instance = Container.instance.resolve(token)
    const listeners: Listener[] = Reflect.getMetadata('custom:listeners', classDefinition)
    listeners.forEach((listeners: Listener) => {
      eventsService.on(listeners.event, async (...args: any[]) => {
        instance[listeners.execute].apply(instance, args)
      })
    })
  })
}
