export type Constructor<T = any> = new (...args: any[]) => T

export type InjectionToken = {
  index: number
  token: string | Constructor
}
