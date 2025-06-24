export function OnEvent(event: string) {
  return function (target: any, propertyKey: string) {
    const listener = {
      event,
      execute: propertyKey,
    }
    Reflect.defineMetadata('listener', listener, target.constructor)
  }
}
