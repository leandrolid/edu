import { HttpStatusCode } from '@domain/enums/http-statuscode.enum'
import { HttpError } from '@domain/errors/http.error'
import { IResponse } from '@infra/http/interfaces/controller'
import { IErrorHandler } from '@infra/http/interfaces/error-handler'
import { ZodError } from 'zod'

export class HttpErrorHandler implements IErrorHandler {
  execute(error: Error, res: IResponse) {
    if (error instanceof HttpError) {
      return res.status(error.statusCode).send({ message: error.message })
    }
    if (error instanceof ZodError) {
      return res
        .status(400)
        .send({ message: 'Erro de validação', errors: error.flatten().fieldErrors })
    }
    console.error(error)
    return {
      message: 'Internal server error',
      statusCode: HttpStatusCode.INTERNAL_SERVER_ERROR,
    }
  }
}
