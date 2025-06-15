import { HttpStatusCode } from '../enums/http-statuscode.enum'
import { HttpError } from './http.error'

export class NotFoundError extends HttpError {
  constructor(message: string) {
    super(HttpStatusCode.NOT_FOUND, message)
    this.name = this.constructor.name
  }
}
