import type { DeleteOrganizationInput } from '@app/organizations/delete-organization/delete-organization.input'
import type { IValidation, IValidator } from '@edu/framework'
import z from 'zod'

export class DeleteOrganizationValidation implements IValidation {
  params: IValidator<DeleteOrganizationInput> = z.object({
    slug: slugSchema,
  })
}

export const slugSchema = z
  .string({ message: 'Slug inválido' })
  .min(1, { message: 'Slug não pode ser vazio' })
