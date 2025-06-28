import { HttpStatusCode } from '../enums/http-statuscode.enum'
import { ServerError } from './server.error'

export class NotFoundError extends ServerError {
  constructor(message: string) {
    super(HttpStatusCode.NOT_FOUND, message)
    this.name = this.constructor.name
  }
}
