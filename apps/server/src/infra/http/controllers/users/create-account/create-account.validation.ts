import { IValidation, IValidator } from '@edu/framework'
import z from 'zod'

export class CreateAccountValidation implements IValidation {
  body: IValidator = z.object({
    name: z.string({ message: 'Nome inválido' }).optional(),
    email: z.string({ message: 'O email é obrigatório' }).email('O email é inválido'),
    password: z
      .string({ message: 'A senha é obrigatória' })
      .min(8, 'A senha deve conter no mínimo 8 caracteres')
      .refine((password) => {
        return /[a-z]/.test(password) && /[A-Z]/.test(password) && /[0-9]/.test(password)
      }, 'A senha deve conter pelo menos uma letra maiúscula, uma letra minúscula e um número'),
  })
}
