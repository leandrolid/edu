import { HttpStatusCode } from '../enums/http-statuscode.enum'

export class ServerError extends Error {
  constructor(
    public readonly statusCode: HttpStatusCode,
    message: string,
    public readonly cause?: Record<string, any>,
  ) {
    super(message)
    this.name = this.constructor.name
  }
}
