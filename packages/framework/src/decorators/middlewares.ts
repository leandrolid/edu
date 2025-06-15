import { Constructor } from '../container'

export function MiddleWares(...middlewares: Constructor[]) {
  return function (target: Constructor) {
    Reflect.defineMetadata('middlewares', middlewares, target)
  }
}
