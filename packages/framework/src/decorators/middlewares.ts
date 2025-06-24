import type { Constructor } from '../interfaces'

export function MiddleWares(...middlewares: Constructor[]) {
  return function (target: Constructor) {
    Reflect.defineMetadata('middlewares', middlewares, target)
  }
}
