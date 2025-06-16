import type { IValidation, IValidator } from '@edu/framework'
import z from 'zod'

export class BasicSignInValidation implements IValidation {
  body: IValidator = z.object({
    email: z.string({ message: 'E-mail é obrigatório' }).email({ message: 'E-mail inválido' }),
    password: z
      .string({ message: 'Senha é obrigatória' })
      .min(8, { message: 'Senha deve ter pelo menos 8 caracteres' }),
  })
}
