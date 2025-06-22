import { HttpStatusCode } from '../enums'
import { HttpError } from './http.error'

export class InternalServerError extends HttpError {
  constructor(message: string) {
    super(HttpStatusCode.INTERNAL_SERVER_ERROR, message)
    this.name = this.constructor.name
  }
}
