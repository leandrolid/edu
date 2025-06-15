import { HttpStatusCode } from '../enums/http-statuscode.enum'
import { HttpError } from './http.error'

export class UnprocessableEntityError extends HttpError {
  constructor(message: string) {
    super(HttpStatusCode.UNPROCESSABLE_ENTITY, message)
    this.name = this.constructor.name
  }
}
