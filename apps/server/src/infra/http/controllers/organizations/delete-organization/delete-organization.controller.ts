import type { DeleteOrganizationInput } from '@app/organizations/delete-organization/delete-organization.input'
import { DeleteOrganizationUseCase } from '@app/organizations/delete-organization/delete-organization.usecase'
import type { IUser } from '@domain/dtos/user.dto'
import {
  Controller,
  Delete,
  Docs,
  MiddleWares,
  Params,
  User,
  Validate,
  type IController,
} from '@edu/framework'
import { DeleteOrganizationValidation } from '@infra/http/controllers/organizations/delete-organization/delete-organization.validation'
import { JwtMiddleware } from '@infra/http/middlewares/jwt.middleware'

@Docs({
  title: 'Delete organization by slug',
  tags: ['Organizations'],
})
@Controller('/organizations')
@MiddleWares(JwtMiddleware)
export class DeleteOrganizationController implements IController {
  constructor(private readonly deleteOrganizationUseCase: DeleteOrganizationUseCase) {}

  @Delete('/:slug')
  @Validate(new DeleteOrganizationValidation())
  async execute(@User() user: IUser, @Params() params: DeleteOrganizationInput) {
    const output = await this.deleteOrganizationUseCase.execute({
      user,
      slug: params.slug,
    })
    return { message: output.message }
  }
}
