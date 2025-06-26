import { UpdateOrganizationInput } from '@app/usecases/organizations/update-organization/update-organization.input'
import { UpdateOrganizationUseCase } from '@app/usecases/organizations/update-organization/update-organization.usecase'
import type { IUser } from '@domain/dtos/user.dto'
import {
  Body,
  Controller,
  Docs,
  MiddleWares,
  Params,
  Put,
  User,
  Validate,
  type IController,
} from '@edu/framework'
import { UpdateOrganizationValidation } from '@infra/http/controllers/organizations/update-organization/update-organization.validation'
import { JwtMiddleware } from '@infra/http/middlewares/jwt.middleware'

@Docs({
  title: 'Update organization by slug',
  tags: ['Organizations'],
})
@Controller('/organizations')
@MiddleWares(JwtMiddleware)
export class UpdateOrganizationController implements IController {
  constructor(private readonly updateOrganizationUseCase: UpdateOrganizationUseCase) {}

  @Put('/:slug')
  @Validate(new UpdateOrganizationValidation())
  async execute(
    @User() user: IUser,
    @Params() params: Pick<UpdateOrganizationInput, 'slug'>,
    @Body() body: Omit<UpdateOrganizationInput, 'slug'>,
  ) {
    const output = await this.updateOrganizationUseCase.execute({
      user,
      slug: params.slug,
      name: body.name,
      avatarUrl: body.avatarUrl,
      shouldAttachUserByDomain: body.shouldAttachUserByDomain,
    })
    return { data: output }
  }
}
