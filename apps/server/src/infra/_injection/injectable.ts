import { Constructor, Container, Scope } from '@infra/_injection/container'

export function Injectable(options?: { scope?: Scope }) {
  return function <T extends Constructor>(target: T) {
    Container.instance.register(target, { useClass: target, scope: options?.scope })
  }
}
