import { Controller, Post } from '@infra/_injection'
import { CreateAccountUseCase } from '@app/users/create-account/create-account.usecase'
import z from 'zod'
import type {
  IController,
  IRequest,
  IResponse,
  IValidation,
} from '@infra/http/interfaces/controller.interface'
import { CreateAccountInput } from '@app/users/create-account/create-account.input'
import { HttpStatusCode } from '@domain/enums/http-statuscode.enum'

@Controller('/users')
export class CreateAccountController implements IController {
  constructor(private readonly createUserUseCase: CreateAccountUseCase) {}

  public validation: IValidation = {
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
  async execute(req: IRequest<CreateAccountInput>, res: IResponse) {
    const { name, email, password } = req.body
    const output = await this.createUserUseCase.execute({ name, email, password })
    return res.status(HttpStatusCode.CREATED).send(output)
  }
}
