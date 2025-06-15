import { IRequest, IResponse } from './controller'

export interface IMiddleware {
  execute(request: IRequest, response: IResponse): Promise<void>
}
