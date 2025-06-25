import { Scope } from '../enums'
import type { Constructor, InjectionToken } from '../interfaces'

export class Container {
  private providers = new Map<
    string,
    {
      useClass: Constructor
      scope: Scope
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
    const injectionTokens: InjectionToken[] = Reflect.getOwnMetadata('custom:inject', provider.useClass) || []
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
