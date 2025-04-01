import type { GetOrganizationInput } from '@app/organizations/get-organization/get-organization.input'
import { GetOrganizationUseCase } from '@app/organizations/get-organization/get-organization.usecase'
import type { IUser } from '@domain/dtos/user.dto'
import { Controller, Docs, Get, MiddleWares, Params, User, Validate } from '@infra/_injection'
import { GetOrganizationValidation } from '@infra/http/controllers/organizations/get-organization/get-organization.validation'
import { IController } from '@infra/http/interfaces/controller'
import { JwtMiddleware } from '@infra/http/middlewares/jwt.middleware'

@Docs({
  title: 'Get one organization',
  tags: ['Organizations'],
})
@Controller('/organizations')
@MiddleWares(JwtMiddleware)
export class GetOrganizationController implements IController {
  constructor(private readonly getOrganizationUseCase: GetOrganizationUseCase) {}

  @Get('/:slug')
  @Validate(new GetOrganizationValidation())
  async execute(@User() user: IUser, @Params() params: GetOrganizationInput) {
    const output = await this.getOrganizationUseCase.execute({
      user,
      slug: params.slug,
    })
    return { data: output }
  }
}
