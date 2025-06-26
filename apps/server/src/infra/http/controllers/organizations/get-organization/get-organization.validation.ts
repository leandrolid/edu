import { GetOrganizationInput } from '@app/usecases/organizations/get-organization/get-organization.input'
import type { IValidation, IValidator } from '@edu/framework'
import z from 'zod'

export class GetOrganizationValidation implements IValidation {
  params: IValidator<GetOrganizationInput> = z.object({
    slug: slugSchema,
  })
}

export const slugSchema = z
  .string({ message: 'Slug inválido' })
  .min(1, { message: 'Slug não pode ser vazio' })
