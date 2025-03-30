import type { CreateOrganizationInput } from '@app/organizations/create-organization/create-organization.input'
import { CreateOrganizationUseCase } from '@app/organizations/create-organization/create-organization.usecase'
import { Body, Controller, Docs, Post, Validate } from '@infra/_injection'
import { CreateOrganizationValidation } from '@infra/http/controllers/organizations/create-organization/create-organization.validation'
import { IController } from '@infra/http/interfaces/controller'

@Controller('/organizations')
@Docs({
  title: 'Create a new organization',
  tags: ['Organizations'],
})
export class CreateOrganizationController implements IController {
  constructor(private readonly createOrganizationUseCase: CreateOrganizationUseCase) {}

  @Post('/')
  @Validate(new CreateOrganizationValidation())
  async execute(@Body() body: CreateOrganizationInput) {
    const output = await this.createOrganizationUseCase.execute({
      name: body.name,
      slug: body.slug,
      avatarUrl: body.avatarUrl,
      domain: body.domain,
      shouldAttachUserByDomain: body.shouldAttachUserByDomain,
    })
    return { data: output }
  }
}
