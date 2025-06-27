import { Container, type ProviderOptions } from '../container'
import { Inject } from '../decorators'

export const createDecorator = <T>(token: string, options?: ProviderOptions<T>) => {
  Container.instance.register(token, options)
  return Inject(token)
}
