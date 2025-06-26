import type { BasicSignInInput } from '@app/usecases/auth/basic-sign-in/basic-sign-in.input'
import { BasicSignInUseCase } from '@app/usecases/auth/basic-sign-in/basic-sign-in.usecase'
import { Body, Controller, Docs, Post, Validate, type IController } from '@edu/framework'
import { BasicSignInValidation } from '@infra/http/controllers/auth/basic-sign-in/basic-sign-in.validation'

@Controller('/auth/signin')
@Docs({
  title: 'Sign in with email and password',
  tags: ['Auth'],
})
export class BasicSignInController implements IController {
  constructor(private readonly basicSignInUseCase: BasicSignInUseCase) {}

  @Post('/')
  @Validate(new BasicSignInValidation())
  async execute(@Body() body: BasicSignInInput) {
    const { email, password } = body
    const output = await this.basicSignInUseCase.execute({ email, password })
    return {
      data: output,
    }
  }
}
