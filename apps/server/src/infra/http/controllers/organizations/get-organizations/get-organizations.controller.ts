import { GetOrganizationsUseCase } from '@app/organizations/get-organizations/get-organizations.usecase'
import type { IUser } from '@domain/dtos/user.dto'
import { Controller, Docs, Get, MiddleWares, User } from '@infra/_injection'
import { IController } from '@infra/http/interfaces/controller'
import { JwtMiddleware } from '@infra/http/middlewares/jwt.middleware'

@Docs({
  title: 'Get all user organizations',
  tags: ['Organizations'],
})
@Controller('/organizations')
@MiddleWares(JwtMiddleware)
export class GetOrganizationsController implements IController {
  constructor(private readonly getOrganizationsUseCase: GetOrganizationsUseCase) {}

  @Get('/')
  async execute(@User() user: IUser) {
    const output = await this.getOrganizationsUseCase.execute({
      user,
    })
    return { data: output.organizations }
  }
}
