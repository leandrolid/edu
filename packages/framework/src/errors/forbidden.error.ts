import { HttpStatusCode } from '../enums/http-statuscode.enum'
import { HttpError } from './http.error'

export class ForbiddenError extends HttpError {
  constructor(message: string) {
    super(HttpStatusCode.FORBIDDEN, message)
    this.name = this.constructor.name
  }
}
