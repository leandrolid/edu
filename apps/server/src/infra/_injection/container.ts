import { Route } from '@infra/_injection/controller'
import { DocsConfig } from '@infra/_injection/docs'
import { IValidation } from '@infra/http/interfaces/controller.interface'

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
}
