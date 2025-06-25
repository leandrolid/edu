import { REQUEST_METADATA_KEYS } from '../decorators'

export function resolveRouteHandler({
  instance,
  execute,
  request,
  requestNode,
  response,
  responseNode,
}: {
  instance: any
  execute: string
  request: Record<string, any>
  requestNode: Record<string, any>
  response: Record<string, any>
  responseNode: Record<string, any>
}) {
  const method = instance[execute]
  const paramCount = method.length
  const args = Array.from({ length: paramCount })
  getKeys(REQUEST_METADATA_KEYS).forEach((reqKey) => {
    resolveParams(REQUEST_METADATA_KEYS[reqKey], instance, execute, args, request[reqKey])
  })
  resolveParams('custom:request', instance, execute, args, request)
  resolveParams('custom:requestNode', instance, execute, args, requestNode)
  resolveParams('custom:response', instance, execute, args, response)
  resolveParams('custom:responseNode', instance, execute, args, responseNode)
  return method.apply(instance, args)
}

function getKeys<T extends object>(obj: T): Array<keyof T> {
  return Object.keys(obj) as Array<keyof T>
}

function resolveParams(key: string, instance: any, execute: string, args: any[], value: any) {
  const paramIndexes: number[] =
    Reflect.getOwnMetadata(key, Object.getPrototypeOf(instance), execute) || []
  paramIndexes.forEach((index) => {
    args[index] = value
  })
}
