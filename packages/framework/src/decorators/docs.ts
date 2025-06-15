import { IValidator } from '../interfaces/controller'

export type DocsConfig = {
  title: string
  tags: string[]
  description?: string
  response?: Record<number, IValidator>
}

export function Docs(docsConfig: DocsConfig) {
  return function (target: any) {
    Reflect.defineMetadata('docs', docsConfig, target)
  }
}
