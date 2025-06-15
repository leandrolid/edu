import { HttpStatusCode } from '../enums/http-statuscode.enum'
import { HttpError } from './http.error'

export class UnauthorizedError extends HttpError {
  constructor(message: string) {
    super(HttpStatusCode.UNAUTHORIZED, message)
    this.name = this.constructor.name
  }
}
