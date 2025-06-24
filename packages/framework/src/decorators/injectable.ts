import { Container } from '../container'
import type { Scope } from '../enums'
import type { Constructor } from '../interfaces'

export function Injectable(options?: { scope?: Scope; token?: string }) {
  return function <T extends Constructor>(target: T) {
    Container.instance.register(options?.token ?? target, {
      useClass: target,
      scope: options?.scope,
    })
  }
}
