import { HttpStatusCode } from '../enums'
import { ServerError } from './server.error'

export class InternalServerError extends ServerError {
  constructor(message: string) {
    super(HttpStatusCode.INTERNAL_SERVER_ERROR, message)
    this.name = this.constructor.name
  }
}
