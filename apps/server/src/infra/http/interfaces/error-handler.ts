import { IResponse } from '@infra/http/interfaces/controller'

export interface IErrorHandler {
  execute(error: Error, res: IResponse): void
}
