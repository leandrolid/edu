import { IValidation, IValidator } from '@infra/http/interfaces/controller.interface'

export class Container {
  private providers = new Map<IConstructor, IProvider>()

  private static _instance: Container

  static get instance() {
    if (!Container._instance) {
      Container._instance = new Container()
    }
    return Container._instance
  }

  private constructor() {}

  register<T>(
    token: IConstructor<T>,
    options: { useClass: IConstructor<T>; scope?: Scope } = {
      useClass: token,
      scope: Scope.Transient,
    },
  ) {
    const scope = options.scope ?? Scope.Transient
    this.providers.set(token, { useClass: options.useClass, scope })
  }

  resolve<T>(token: IConstructor<T>): T {
    const provider = this.providers.get(token)

    if (!provider) {
      throw new Error(`No provider found for ${token}`)
    }

    // Handle singleton
    if (provider.scope === Scope.Singleton && provider.instance) {
      return provider.instance
    }

    const paramTypes: IConstructor[] =
      Reflect.getMetadata('design:paramtypes', provider.useClass) || []
    const dependencies = paramTypes.map((param) => this.resolve(param))
    const instance = new provider.useClass(...dependencies)

    if (provider.scope === Scope.Singleton) {
      provider.instance = instance
    }

    return instance
  }

  resolveController<T>(token: IConstructor<T>) {
    const instance = Container.instance.resolve(token)
    const routes: IRoute[] = Reflect.getMetadata('routes', token) || []
    const prefix = Reflect.getMetadata('prefix', token) || ''
    const docs: IApiDocs = Reflect.getMetadata('docs', token) || {}
    const validation: IValidation = Reflect.getMetadata('validation', token) || {}
    return {
      instance,
      routes,
      prefix,
      docs,
      validation,
    }
  }
}

export function Injectable(options?: { scope?: Scope }) {
  return function <T extends IConstructor>(target: T) {
    Container.instance.register(target, { useClass: target, scope: options?.scope })
  }
}

export function Controller(prefix: string = '') {
  return function (target: IConstructor) {
    Reflect.defineMetadata('prefix', prefix, target)
    Container.instance.register(target)
  }
}

// HTTP method decorators
export const Get = createRouteDecorator('get')
export const Post = createRouteDecorator('post')
export const Put = createRouteDecorator('put')
export const Delete = createRouteDecorator('delete')
export const Patch = createRouteDecorator('patch')

function createRouteDecorator(method: 'get' | 'post' | 'put' | 'delete' | 'patch') {
  return function (path: string) {
    return function (target: any, propertyKey: string) {
      const routes: IRoute[] = Reflect.getMetadata('routes', target.constructor) || []

      routes.push({
        method,
        path,
        execute: propertyKey,
      })

      Reflect.defineMetadata('routes', routes, target.constructor)
    }
  }
}

export function Validate(validation: IValidation) {
  return function (target: any, _propertyKey: string) {
    Reflect.defineMetadata('validation', validation, target.constructor)
  }
}

type IApiDocs = {
  title: string
  tags: string[]
  description?: string
  response?: Record<number, IValidator>
}

export function Docs(docs: IApiDocs) {
  return function (target: any) {
    Reflect.defineMetadata('docs', docs, target)
  }
}

export type IConstructor<T = any> = new (...args: any[]) => T

enum Scope {
  Singleton,
  Transient,
}

type IProvider<T = any> = {
  useClass: IConstructor<T>
  scope: Scope
  instance?: T
}

export type IRoute = {
  path: string
  method: 'get' | 'post' | 'put' | 'delete' | 'patch'
  execute: string
}
