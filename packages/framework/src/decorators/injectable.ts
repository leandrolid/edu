import { Constructor, Container, Scope } from '../container'

export function Injectable(options?: { scope?: Scope; token?: string }) {
  return function <T extends Constructor>(target: T) {
    Container.instance.register(options?.token ?? target, {
      useClass: target,
      scope: options?.scope,
    })
  }
}
