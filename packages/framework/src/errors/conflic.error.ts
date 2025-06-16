import { HttpStatusCode } from '../enums'
import { HttpError } from './http.error'

export class ConflictError extends HttpError {
  constructor(message: string) {
    super(HttpStatusCode.CONFLICT, message)
    this.name = this.constructor.name
  }
}
