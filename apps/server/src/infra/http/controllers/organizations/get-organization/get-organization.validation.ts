import { GetOrganizationInput } from '@app/organizations/get-organization/get-organization.input'
import { IValidation, IValidator } from '@infra/http/interfaces/controller'
import z from 'zod'

export class GetOrganizationValidation implements IValidation {
  params: IValidator<GetOrganizationInput> = z.object({
    slug: z.string({ message: 'Slug inválido' }).min(1, 'Slug é obrigatório'),
  })
}
