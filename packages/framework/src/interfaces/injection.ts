import type { Scope } from '../enums'

export type Constructor<T = any> = new (...args: any[]) => T

export type Provider<T = any> = {
  useClass: Constructor<T>
  scope: Scope
  instance?: T
}

export type InjectionToken = {
  index: number
  token: string | Constructor
}
