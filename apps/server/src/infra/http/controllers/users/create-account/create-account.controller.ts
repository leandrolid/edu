import type { CreateAccountInput } from '@app/usecases/users/create-account/create-account.input'
import { CreateAccountUseCase } from '@app/usecases/users/create-account/create-account.usecase'
import { Body, Controller, Docs, Post, Validate, type IController } from '@edu/framework'
import { CreateAccountValidation } from '@infra/http/controllers/users/create-account/create-account.validation'

@Controller('/users')
@Docs({
  title: 'Create a new account',
  tags: ['Users'],
})
export class CreateAccountController implements IController {
  constructor(private readonly createAccountUseCase: CreateAccountUseCase) {}

  @Post('/')
  @Validate(new CreateAccountValidation())
  async execute(@Body() body: CreateAccountInput) {
    const { name, email, password } = body
    const output = await this.createAccountUseCase.execute({ name, email, password })
    return { data: output }
  }
}
