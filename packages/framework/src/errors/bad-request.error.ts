import { HttpStatusCode } from '../enums/http-statuscode.enum'
import { ServerError } from './server.error'

export class BadRequestError extends ServerError {
  constructor(message: string) {
    super(HttpStatusCode.BAD_REQUEST, message)
    this.name = this.constructor.name
  }
}
