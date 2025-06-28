import { HttpStatusCode } from '../enums'
import { ServerError } from './server.error'

export class ConflictError extends ServerError {
  constructor(message: string, cause?: Record<string, any>) {
    super(HttpStatusCode.CONFLICT, message, cause)
    this.name = this.constructor.name
  }
}
