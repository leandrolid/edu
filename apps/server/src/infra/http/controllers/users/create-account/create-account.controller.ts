import type { CreateAccountInput } from '@app/users/create-account/create-account.input'
import { CreateAccountUseCase } from '@app/users/create-account/create-account.usecase'
import { Body, Controller, Docs, Post, Validate } from '@infra/_injection'
import { CreateAccountValidation } from '@infra/http/controllers/users/create-account/create-account.validation'
import type { IController } from '@infra/http/interfaces/controller.interface'

@Controller('/users')
@Docs({
  title: 'Create a new account',
  tags: ['Users'],
})
export class CreateAccountController implements IController {
  constructor(private readonly createUserUseCase: CreateAccountUseCase) {}

  @Post('/')
  @Validate(new CreateAccountValidation())
  async execute(@Body() body: CreateAccountInput) {
    const { name, email, password } = body
    const output = await this.createUserUseCase.execute({ name, email, password })
    return output
  }
}
