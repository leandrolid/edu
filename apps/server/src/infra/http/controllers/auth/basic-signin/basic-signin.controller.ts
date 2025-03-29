import type { BasicSignInInput } from '@app/auth/basic-sign-in.input'
import { BasicSignInUseCase } from '@app/auth/basic-sign-in.usecase'
import { Body, Controller, Docs, Post, Validate } from '@infra/_injection'
import { BasicSignInValidation } from '@infra/http/controllers/auth/basic-signin/basic-signin.validation'
import { IController } from '@infra/http/interfaces/controller.interface'

@Controller('/auth/signin')
@Docs({
  title: 'Sign in with email and password',
  tags: ['Auth'],
})
export class BasicSignInController implements IController {
  constructor(private readonly createUserUseCase: BasicSignInUseCase) {}

  @Post('/')
  @Validate(new BasicSignInValidation())
  async execute(@Body() body: BasicSignInInput) {
    const { email, password } = body
    const output = await this.createUserUseCase.execute({ email, password })
    return output
  }
}
