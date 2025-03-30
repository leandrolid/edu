import type { BasicSignInInput } from '@app/auth/basic-sign-in/basic-sign-in.input'
import { BasicSignInUseCase } from '@app/auth/basic-sign-in/basic-sign-in.usecase'
import { Body, Controller, Docs, Post, Validate } from '@infra/_injection'
import { BasicSignInValidation } from '@infra/http/controllers/auth/basic-sign-in/basic-sign-in.validation'
import { IController } from '@infra/http/interfaces/controller.interface'

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
    return { data: output }
  }
}
