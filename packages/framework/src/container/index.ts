import { Scope } from '../enums'
import type { Constructor, InjectionToken } from '../interfaces'

export type ProviderOptions<T> = {
  scope?: Scope
  useClass?: Constructor<T>
  useFactory?: (...args: any[]) => T
  useValue?: T
}

export class Container {
  private providers = new Map<
    string,
    ProviderOptions<any> & {
      instance?: InstanceType<Constructor>
    }
  >()

  private static _instance: Container

  static get instance() {
    if (!Container._instance) {
      Container._instance = new Container()
    }
    return Container._instance
  }

  private constructor() {}

  register<T, Token extends Constructor<T> | string>(
    token: Token,
    options: ProviderOptions<T> = {},
  ) {
    const scope = options.scope ?? Scope.Transient
    this.providers.set(typeof token === 'string' ? token : token.name, {
      useClass: typeof token === 'string' ? options.useClass : token,
      useFactory: options.useFactory,
      useValue: options.useValue,
      scope,
    })
  }

  resolve<T>(token: Constructor<T> | string): T {
    const provider = this.providers.get(typeof token === 'string' ? token : token.name)
    if (!provider) throw new Error(`No provider found for ${token}`)
    if (provider.scope === Scope.Singleton && provider.instance) return provider.instance
    if (provider.useValue) {
      return provider.useValue
    }
    if (provider.useFactory) {
      return provider.useFactory()
    }
    if (!provider.useClass) {
      throw new Error(`No class or factory provided for ${token}`)
    }
    const paramTypes: Constructor[] =
      Reflect.getMetadata('design:paramtypes', provider.useClass) || []
    const injectionTokens: InjectionToken[] =
      Reflect.getOwnMetadata('custom:inject', provider.useClass) || []
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
}
