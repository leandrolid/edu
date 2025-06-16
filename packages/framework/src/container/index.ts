import { REQUEST_METADATA_KEYS, Route } from '../decorators/controller'
import { DocsConfig } from '../decorators/docs'
import { IRequest, IResponse, IValidation } from '../interfaces/controller'
import { IMiddleware } from '../interfaces/middleware'

export enum Scope {
  Singleton,
  Transient,
}

export type Constructor<T = any> = new (...args: any[]) => T

type Provider<T = any> = {
  useClass: Constructor<T>
  scope: Scope
  instance?: T
}

export class Container {
  private providers = new Map<string, Provider>()

  private static _instance: Container

  static get instance() {
    if (!Container._instance) {
      Container._instance = new Container()
    }
    return Container._instance
  }

  private constructor() {}

  register<T>(
    token: Constructor<T> | string,
    options?: {
      useClass: Constructor<T>
      scope?: Scope
    },
  ) {
    const scope = options?.scope ?? Scope.Transient
    this.providers.set(typeof token === 'string' ? token : token.name, {
      useClass: typeof token === 'string' ? options!.useClass : token,
      scope,
    })
  }

  resolve<T>(token: Constructor<T> | string): T {
    const provider = this.providers.get(typeof token === 'string' ? token : token.name)

    if (!provider) {
      throw new Error(`No provider found for ${token}`)
    }

    if (provider.scope === Scope.Singleton && provider.instance) {
      return provider.instance
    }

    const paramTypes: Constructor[] =
      Reflect.getMetadata('design:paramtypes', provider.useClass) || []

    // prettier-ignore
    const injectionTokens: { index: number; token: string | Constructor }[] = Reflect.getOwnMetadata('custom:inject', provider.useClass) || []
    const dependencies = paramTypes.map((dep, paramIndex) => {
      const injection = injectionTokens.find((item) => item.index === paramIndex)
      if (injection) {
        return this.resolve(injection.token)
      }
      return this.resolve(dep)
    })
    const instance = new provider.useClass(...dependencies)

    if (provider.scope === Scope.Singleton) {
      provider.instance = instance
    }

    return instance
  }

  resolveController<T>(token: Constructor<T>) {
    const instance = Container.instance.resolve(token)
    const route: Route = Reflect.getMetadata('route', token) || {}
    const prefix = Reflect.getMetadata('prefix', token) || ''
    const docs: DocsConfig = Reflect.getMetadata('docs', token) || {}
    const validation: IValidation = Reflect.getMetadata('validation', token) || {}
    const middlewares = this.resolveMiddlewares(token)
    return {
      instance,
      route,
      prefix,
      docs,
      validation,
      middlewares,
    }
  }

  resolveRouteHandler({
    instance,
    execute,
    request,
    response,
  }: {
    instance: any
    execute: string
    request: IRequest
    response: IResponse
  }) {
    const method = instance[execute]
    const paramCount = method.length
    const args = Array.from({ length: paramCount })
    this.getKeys(REQUEST_METADATA_KEYS).forEach((reqKey) => {
      // @ts-ignore
      this.resolveParams(REQUEST_METADATA_KEYS[reqKey], instance, execute, args, request[reqKey])
    })
    this.resolveParams('custom:request', instance, execute, args, request)
    this.resolveParams('custom:response', instance, execute, args, response)
    return method.apply(instance, args)
  }

  private getKeys<T extends object>(obj: T): Array<keyof T> {
    return Object.keys(obj) as Array<keyof T>
  }

  private resolveParams(key: string, instance: any, execute: string, args: any[], value: any) {
    // prettier-ignore
    const paramIndexes: number[] = Reflect.getOwnMetadata(key, Object.getPrototypeOf(instance), execute) || []
    paramIndexes.forEach((index) => {
      args[index] = value
    })
  }

  private resolveMiddlewares(token: Constructor): IMiddleware[] {
    const middlewares: Constructor[] = Reflect.getMetadata('middlewares', token) || []
    return middlewares.map((middleware) => this.resolve(middleware))
  }
}
