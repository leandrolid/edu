import { HttpStatusCode } from '../enums/http-statuscode.enum'
import { ServerError } from './server.error'

export class UnprocessableEntityError extends ServerError {
  constructor(message: string, cause?: Record<string, any>) {
    super(HttpStatusCode.UNPROCESSABLE_ENTITY, message, cause)
    this.name = this.constructor.name
  }
}
