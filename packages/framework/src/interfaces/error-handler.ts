import type { IResponse } from './controller'

export interface IErrorHandler {
  execute(error: Error, res: IResponse): void
}
