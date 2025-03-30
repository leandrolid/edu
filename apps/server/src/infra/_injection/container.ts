import 'reflect-metadata'

import { REQUEST_METADATA_KEYS, Route } from '@infra/_injection/controller'
import { DocsConfig } from '@infra/_injection/docs'
import { IRequest, IResponse, IValidation } from '@infra/http/interfaces/controller.interface'

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
    return {
      instance,
      route,
      prefix,
      docs,
      validation,
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
    const requestProperties = ['body', 'query', 'params', 'headers'] as const
    requestProperties.forEach((reqKey) => {
      // prettier-ignore
      const requestIndexes: number[] = Reflect.getOwnMetadata(REQUEST_METADATA_KEYS[reqKey], Object.getPrototypeOf(instance), execute) || []
      requestIndexes.forEach((index) => {
        args[index] = request[reqKey]
      })
    })
    // prettier-ignore
    const responseIndex: number[] = Reflect.getOwnMetadata('custom:response', Object.getPrototypeOf(instance), execute) || []
    responseIndex.forEach((index) => {
      args[index] = response
    })
    if (paramCount > 0 && args[0] === undefined) args[0] = request
    if (paramCount > 1 && args[1] === undefined) args[1] = response
    return method.apply(instance, args)
  }
}
