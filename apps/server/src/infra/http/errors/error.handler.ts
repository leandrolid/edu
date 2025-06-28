import { HttpStatusCode, IErrorHandler, ServerError, type IResponse } from '@edu/framework'

export class HttpErrorHandler implements IErrorHandler {
  execute(error: Error, res: IResponse) {
    if (error instanceof ServerError) {
      return res.status(error.statusCode).send({ message: error.message, errors: error.cause })
    }
    console.error(error)
    return {
      message: 'Internal server error',
      statusCode: HttpStatusCode.INTERNAL_SERVER_ERROR,
    }
  }
}
