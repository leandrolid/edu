import { IResponse } from '@infra/http/interfaces/controller.interface'

export interface IErrorHandler {
  execute(error: Error, res: IResponse): void
}
