import type { IValidation, IValidator } from '@edu/framework'
import z from 'zod'

export class BasicSignInValidation implements IValidation {
  body: IValidator = z.object({
    email: z.string().email(),
    password: z.string().min(8),
  })
}
