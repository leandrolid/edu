import { Constructor, Container, Scope } from '@infra/_injection/container'

export function Injectable(options?: { scope?: Scope; target?: any }) {
  return function <T extends Constructor>(target: T) {
    Container.instance.register(options?.target ?? target, {
      useClass: target,
      scope: options?.scope,
    })
  }
}
