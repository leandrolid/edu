import { HttpStatusCode } from '@domain/enums/http-statuscode.enum'
import { HttpError } from '@domain/errors/http.error'

export class ForbiddenError extends HttpError {
  constructor(message: string) {
    super(HttpStatusCode.FORBIDDEN, message)
    this.name = this.constructor.name
  }
}
