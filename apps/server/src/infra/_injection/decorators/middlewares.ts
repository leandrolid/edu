import { Constructor } from '@infra/_injection/container'

export function MiddleWares(...middlewares: Constructor[]) {
  return function (target: Constructor) {
    Reflect.defineMetadata('middlewares', middlewares, target)
  }
}
