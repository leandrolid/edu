import { HttpStatusCode } from '@domain/enums/http-statuscode.enum'
import { HttpError } from '@domain/errors/http.error'

export class NotFoundError extends HttpError {
  constructor(message: string) {
    super(HttpStatusCode.NOT_FOUND, message)
    this.name = this.constructor.name
  }
}
