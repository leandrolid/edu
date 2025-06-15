import { HttpError, HttpStatusCode, IErrorHandler, type IResponse } from '@edu/framework'
import { hasZodFastifySchemaValidationErrors } from 'fastify-type-provider-zod'

export class HttpErrorHandler implements IErrorHandler {
  execute(error: Error, res: IResponse) {
    console.error(error)
    if (error instanceof HttpError) {
      return res.status(error.statusCode).send({ message: error.message })
    }

    if (hasZodFastifySchemaValidationErrors(error)) {
      return res.status(400).send({
        message: 'Erro de validação',
        errors: error.validation.reduce(
          (acc, validation) => ({
            ...acc,
            [validation.instancePath.replace('/', '')]: [validation.message],
          }),
          {},
        ),
      })
    }
    console.error(error)
    return {
      message: 'Internal server error',
      statusCode: HttpStatusCode.INTERNAL_SERVER_ERROR,
    }
  }
}
