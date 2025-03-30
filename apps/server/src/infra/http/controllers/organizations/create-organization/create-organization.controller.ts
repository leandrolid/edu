import type { CreateOrganizationInput } from '@app/organizations/create-organization/create-organization.input'
import { CreateOrganizationUseCase } from '@app/organizations/create-organization/create-organization.usecase'
import type { IUser } from '@domain/dtos/user.dto'
import { Body, Controller, Docs, Post, User, Validate } from '@infra/_injection'
import { MiddleWares } from '@infra/_injection/decorators/middlewares'
import { CreateOrganizationValidation } from '@infra/http/controllers/organizations/create-organization/create-organization.validation'
import type { IController } from '@infra/http/interfaces/controller'
import { JwtMiddleware } from '@infra/http/middlewares/jwt.middleware'

@Docs({
  title: 'Create a new organization',
  tags: ['Organizations'],
})
@Controller('/organizations')
@MiddleWares(JwtMiddleware)
export class CreateOrganizationController implements IController {
  constructor(private readonly createOrganizationUseCase: CreateOrganizationUseCase) {}

  @Post('/')
  @Validate(new CreateOrganizationValidation())
  async execute(@User() user: IUser, @Body() body: CreateOrganizationInput) {
    const output = await this.createOrganizationUseCase.execute({
      user,
      name: body.name,
      slug: body.slug,
      avatarUrl: body.avatarUrl,
      domain: body.domain,
      shouldAttachUserByDomain: body.shouldAttachUserByDomain,
    })
    return { data: output }
  }
}
