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
  private providers = new Map<Constructor, Provider>()

  private static _instance: Container

  static get instance() {
    if (!Container._instance) {
      Container._instance = new Container()
    }
    return Container._instance
  }

  private constructor() {}

  register<T>(
    token: Constructor<T>,
    options: { useClass: Constructor<T>; scope?: Scope } = {
      useClass: token,
      scope: Scope.Transient,
    },
  ) {
    const scope = options.scope ?? Scope.Transient
    this.providers.set(token, { useClass: options.useClass, scope })
  }

  resolve<T>(token: Constructor<T>): T {
    const provider = this.providers.get(token)

    if (!provider) {
      throw new Error(`No provider found for ${token}`)
    }

    if (provider.scope === Scope.Singleton && provider.instance) {
      return provider.instance
    }

    const paramTypes: Constructor[] =
      Reflect.getMetadata('design:paramtypes', provider.useClass) || []
    const dependencies = paramTypes.map((param) => this.resolve(param))
    const instance = new provider.useClass(...dependencies)

    if (provider.scope === Scope.Singleton) {
      provider.instance = instance
    }

    return instance
  }

  resolveController<T>(token: Constructor<T>) {
    const instance = Container.instance.resolve(token)
    const routes: Route[] = Reflect.getMetadata('routes', token) || []
    const prefix = Reflect.getMetadata('prefix', token) || ''
    const docs: DocsConfig = Reflect.getMetadata('docs', token) || {}
    const validation: IValidation = Reflect.getMetadata('validation', token) || {}
    return {
      instance,
      routes,
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
      const indices: number[] =
        Reflect.getOwnMetadata(
          REQUEST_METADATA_KEYS[reqKey],
          Object.getPrototypeOf(instance),
          execute,
        ) || []
      indices.forEach((index) => {
        args[index] = request[reqKey]
      })
    })
    if (paramCount > 0 && args[0] === undefined) args[0] = request
    if (paramCount > 1 && args[1] === undefined) args[1] = response
    return method.apply(instance, args)
  }
}
