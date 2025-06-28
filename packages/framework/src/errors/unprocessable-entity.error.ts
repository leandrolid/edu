import { HttpStatusCode } from '../enums/http-statuscode.enum'
import { ServerError } from './server.error'

export class UnprocessableEntityError extends ServerError {
  constructor(message: string) {
    super(HttpStatusCode.UNPROCESSABLE_ENTITY, message)
    this.name = this.constructor.name
  }
}
