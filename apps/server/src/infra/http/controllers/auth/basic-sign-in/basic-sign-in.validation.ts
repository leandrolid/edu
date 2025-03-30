import { IValidation, IValidator } from '@infra/http/interfaces/controller'
import z from 'zod'

export class BasicSignInValidation implements IValidation {
  body: IValidator = z.object({
    email: z.string().email(),
    password: z.string().min(8),
  })
}
