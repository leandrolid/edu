import { IRequest, IResponse } from '@infra/http/interfaces/controller'

export interface IMiddleware {
  execute(request: IRequest, response: IResponse): Promise<void>
}
