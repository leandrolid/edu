import { HttpStatusCode } from '@domain/enums/http-statuscode.enum'
import { Constructor, Container } from '@infra/_injection/container'
import { IValidation } from '@infra/http/interfaces/controller.interface'

export type Route = {
  path: string
  method: 'get' | 'post' | 'put' | 'delete' | 'patch'
  execute: string
  status: HttpStatusCode
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
      const route = {
        method,
        path,
        execute: propertyKey,
        status: method === 'post' ? HttpStatusCode.CREATED : HttpStatusCode.OK,
      }
      Reflect.defineMetadata('route', route, target.constructor)
    }
  }
}

export const Get = createRouteDecorator('get')
export const Post = createRouteDecorator('post')
export const Put = createRouteDecorator('put')
export const Delete = createRouteDecorator('delete')
export const Patch = createRouteDecorator('patch')

export function Validate(validation: IValidation) {
  return function (target: any, _: string) {
    Reflect.defineMetadata('validation', validation, target.constructor)
  }
}

export const REQUEST_METADATA_KEYS = {
  body: 'custom:body',
  query: 'custom:query',
  params: 'custom:params',
  headers: 'custom:headers',
} as const

function createRequestDecorator<K extends keyof typeof REQUEST_METADATA_KEYS>(key: K) {
  return function () {
    return function (target: Object, propertyKey: string | symbol, parameterIndex: number) {
      const existingIndices: number[] =
        Reflect.getOwnMetadata(REQUEST_METADATA_KEYS[key], target, propertyKey) || []
      existingIndices.push(parameterIndex)
      Reflect.defineMetadata(REQUEST_METADATA_KEYS[key], existingIndices, target, propertyKey)
    }
  }
}

export const Body = createRequestDecorator('body')
export const Query = createRequestDecorator('query')
export const Params = createRequestDecorator('params')
export const Headers = createRequestDecorator('headers')

export function Response() {
  return function (target: any, propertyKey: string | symbol, parameterIndex: number) {
    const existingIndices: number[] =
      Reflect.getOwnMetadata('custom:response', target, propertyKey) || []
    existingIndices.push(parameterIndex)
    Reflect.defineMetadata('custom:response', existingIndices, target, propertyKey)
  }
}
