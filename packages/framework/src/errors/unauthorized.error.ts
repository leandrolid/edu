import { HttpStatusCode } from '../enums/http-statuscode.enum'
import { ServerError } from './server.error'

export class UnauthorizedError extends ServerError {
  constructor(message: string) {
    super(HttpStatusCode.UNAUTHORIZED, message)
    this.name = this.constructor.name
  }
}
