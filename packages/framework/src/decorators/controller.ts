import { Container } from '../container'
import { HttpStatusCode } from '../enums/http-statuscode.enum'
import type { Constructor } from '../interfaces'
import { IValidation } from '../interfaces/controller'

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

export type RequestMetadataKeys = 'body' | 'query' | 'params' | 'headers' | 'user' | 'form'

export const REQUEST_METADATA_KEYS: { [Key in RequestMetadataKeys]: `custom:${Key}` } = {
  body: 'custom:body',
  query: 'custom:query',
  params: 'custom:params',
  headers: 'custom:headers',
  user: 'custom:user',
  form: 'custom:form',
}

function createRequestDecorator<K extends RequestMetadataKeys>(key: K) {
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
export const User = createRequestDecorator('user')
export const Form = createRequestDecorator('form')

export function Response() {
  return function (target: any, propertyKey: string | symbol, parameterIndex: number) {
    const existingIndices: number[] =
      Reflect.getOwnMetadata('custom:response', target, propertyKey) || []
    existingIndices.push(parameterIndex)
    Reflect.defineMetadata('custom:response', existingIndices, target, propertyKey)
  }
}

export function ResponseNode() {
  return function (target: any, propertyKey: string | symbol, parameterIndex: number) {
    const existingIndices: number[] =
      Reflect.getOwnMetadata('custom:responseNode', target, propertyKey) || []
    existingIndices.push(parameterIndex)
    Reflect.defineMetadata('custom:responseNode', existingIndices, target, propertyKey)
  }
}

export function Request() {
  return function (target: any, propertyKey: string | symbol, parameterIndex: number) {
    const existingIndices: number[] =
      Reflect.getOwnMetadata('custom:request', target, propertyKey) || []
    existingIndices.push(parameterIndex)
    Reflect.defineMetadata('custom:request', existingIndices, target, propertyKey)
  }
}

export function RequestNode() {
  return function (target: any, propertyKey: string | symbol, parameterIndex: number) {
    const existingIndices: number[] =
      Reflect.getOwnMetadata('custom:requestNode', target, propertyKey) || []
    existingIndices.push(parameterIndex)
    Reflect.defineMetadata('custom:requestNode', existingIndices, target, propertyKey)
  }
}

export function Stream() {
  return function (target: any) {
    Reflect.defineMetadata('stream', true, target)
  }
}
