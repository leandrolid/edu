export type Listener = {
  event: string
  execute: string
}

export function OnEvent(event: string) {
  return function (target: any, propertyKey: string) {
    const listeners = Reflect.getMetadata('custom:listeners', target.constructor) || []
    const listener: Listener = {
      event,
      execute: propertyKey,
    }
    listeners.push(listener)
    Reflect.defineMetadata('custom:listeners', listeners, target.constructor)
  }
}
