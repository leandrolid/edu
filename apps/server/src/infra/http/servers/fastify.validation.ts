import { IValidation, IValidator } from '@infra/http/interfaces/controller.interface'
import z from 'zod'

export class DefaultValidation implements IValidation {
  headers?: IValidator<unknown> | undefined = z.any()
  params?: IValidator<unknown> | undefined = z.any()
  query?: IValidator<unknown> | undefined = z.any()
  body?: IValidator<unknown> | undefined = z.any()
}
