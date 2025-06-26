import type { DeleteOrganizationInput } from '@app/usecases/organizations/delete-organization/delete-organization.input'
import type { IValidation, IValidator } from '@edu/framework'
import { slugSchema } from '@infra/http/controllers/organizations/get-organization/get-organization.validation'
import z from 'zod'

export class DeleteOrganizationValidation implements IValidation {
  params: IValidator<DeleteOrganizationInput> = z.object({
    slug: slugSchema,
  })
}
