import { Constructor, Container } from '@infra/_injection/container'
import { IValidation } from '@infra/http/interfaces/controller.interface'

export type Route = {
  path: string
  method: 'get' | 'post' | 'put' | 'delete' | 'patch'
  execute: string
}

export function Controller(prefix: string = '') {
  return function (target: Constructor) {
    Reflect.defineMetadata('prefix', prefix, target)
    Container.instance.register(target)
  }
}

function createRouteDecorator(method: 'get' | 'post' | 'put' | 'delete' | 'patch') {
  return function (path: string) {
    return function (target: any, propertyKey: string) {
      const routes: Route[] = Reflect.getMetadata('routes', target.constructor) || []
      routes.push({ method, path, execute: propertyKey })
      Reflect.defineMetadata('routes', routes, target.constructor)
    }
  }
}

export const Get = createRouteDecorator('get')
export const Post = createRouteDecorator('post')
export const Put = createRouteDecorator('put')
export const Delete = createRouteDecorator('delete')
export const Patch = createRouteDecorator('patch')

export function Validate(validation: IValidation) {
  return function (target: any, _propertyKey: string) {
    Reflect.defineMetadata('validation', validation, target.constructor)
  }
}
