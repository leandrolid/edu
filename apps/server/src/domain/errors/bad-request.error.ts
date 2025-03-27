import { HttpStatusCode } from 'src/domain/enums/http-statuscode.enum'
import { HttpError } from 'src/domain/errors/http.error'

export class BadRequestError extends HttpError {
  constructor(message: string) {
    super(HttpStatusCode.BAD_REQUEST, message)
    this.name = this.constructor.name
  }
}
