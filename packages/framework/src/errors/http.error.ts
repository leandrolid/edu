import { HttpStatusCode } from '../enums/http-statuscode.enum'

export class HttpError extends Error {
  constructor(
    public readonly statusCode: HttpStatusCode,
    message: string,
  ) {
    super(message)
    this.name = this.constructor.name
  }
}
