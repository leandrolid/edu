import { Controller, Post } from '@infra/_injection'
import { CreateAccountUseCase } from '@app/users/create-account/create-account.usecase'
import z from 'zod'

@Controller('/users')
export class CreateAccountController {
  constructor(private readonly createUserUseCase: CreateAccountUseCase) {}

  public validation = {
    body: z.object({
      name: z.string({ message: 'Nome inválido' }).optional(),
      email: z.string({ message: 'O email é obrigatório' }).email('O email é inválido'),
      password: z
        .string({ message: 'A senha é obrigatória' })
        .min(8, 'A senha deve conter no mínimo 8 caracteres')
        .refine((password) => {
          return /[a-z]/.test(password) && /[A-Z]/.test(password) && /[0-9]/.test(password)
        }, 'A senha deve conter pelo menos uma letra maiúscula, uma letra minúscula e um número'),
    }),
  }

  @Post('/')
  async execute(req: any, res: any) {
    const { name, email, password } = req.body
    const output = await this.createUserUseCase.execute({ name, email, password })
    return res.status(201).send(output)
  }
}
