import 'reflect-metadata'

export type Constructor<T = any> = new (...args: any[]) => T

enum Scope {
  Singleton,
  Transient,
}

interface Provider<T = any> {
  useClass: Constructor<T>
  scope: Scope
  instance?: T
}

export interface RouteDefinition {
  path: string
  method: 'get' | 'post' | 'put' | 'delete' | 'patch'
  execute: string
}

export class Container {
  private providers = new Map<Constructor, Provider>()
  private controllers: Constructor[] = []

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

    // Handle singleton
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
    const routes: RouteDefinition[] = Reflect.getMetadata('routes', token) || []
    const prefix = Reflect.getMetadata('prefix', token) || ''
    return {
      instance,
      routes,
      prefix,
    }
  }
}

export function Injectable(options?: { scope?: Scope }) {
  return function <T extends Constructor>(target: T) {
    Container.instance.register(target, { useClass: target, scope: options?.scope })
  }
}

export function Controller(prefix: string = '') {
  return function (target: Constructor) {
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
      const routes: RouteDefinition[] = Reflect.getMetadata('routes', target.constructor) || []

      routes.push({
        method,
        path,
        execute: propertyKey,
      })

      Reflect.defineMetadata('routes', routes, target.constructor)
    }
  }
}
