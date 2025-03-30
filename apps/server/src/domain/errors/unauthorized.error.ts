import { HttpStatusCode } from '@domain/enums/http-statuscode.enum'
import { HttpError } from '@domain/errors/http.error'

export class UnauthorizedError extends HttpError {
  constructor(message: string) {
    super(HttpStatusCode.UNAUTHORIZED, message)
    this.name = this.constructor.name
  }
}
