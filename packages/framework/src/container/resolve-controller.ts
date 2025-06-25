import { Container } from '.'
import { Route } from '../decorators/controller'
import { DocsConfig } from '../decorators/docs'
import type { Constructor } from '../interfaces'
import { IValidation } from '../interfaces/controller'
import { IMiddleware } from '../interfaces/middleware'

export function resolveController<T>(token: Constructor<T>) {
  const instance = Container.instance.resolve(token)
  const route: Route = Reflect.getMetadata('route', token) || {}
  const prefix = Reflect.getMetadata('prefix', token) || ''
  const docs: DocsConfig = Reflect.getMetadata('docs', token) || {}
  const validation: IValidation = Reflect.getMetadata('validation', token) || {}
  const middlewares = resolveMiddlewares(token)
  const isStream = Reflect.getMetadata('stream', token) || false
  return {
    instance,
    route,
    prefix,
    docs,
    validation,
    middlewares,
    isStream,
  }
}

function resolveMiddlewares(token: Constructor): IMiddleware[] {
  const middlewares: Constructor[] = Reflect.getMetadata('middlewares', token) || []
  return middlewares.map((middleware) => Container.instance.resolve(middleware))
}
