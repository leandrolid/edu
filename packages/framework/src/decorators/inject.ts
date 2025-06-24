import type { Constructor } from '../interfaces'

export function Inject(token: string | Constructor) {
  return function (target: any, _: any, parameterIndex: number) {
    const existingInjectedTokens: { index: number; token: string | Constructor }[] =
      Reflect.getOwnMetadata('custom:inject', target) || []
    existingInjectedTokens.push({ index: parameterIndex, token })
    Reflect.defineMetadata('custom:inject', existingInjectedTokens, target)
  }
}
