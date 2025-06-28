import { HttpStatusCode } from '../enums/http-statuscode.enum'
import { ServerError } from './server.error'

export class ForbiddenError extends ServerError {
  constructor(message: string) {
    super(HttpStatusCode.FORBIDDEN, message)
    this.name = this.constructor.name
  }
}
