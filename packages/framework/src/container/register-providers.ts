import { Container } from '.'
import type { Provider } from '../interfaces'

export function registerProviders(providers?: Provider[]) {
  if (!providers || !Array.isArray(providers)) return
  providers.forEach((provider) => {
    if (!('provide' in provider)) return
    Container.instance.register(provider.provide, {
      useClass: provider.useClass,
    })
  })
}
