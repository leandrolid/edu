import { UpdateOrganizationInput } from '@app/organizations/update-organization/update-organization.input'
import { IValidation, IValidator } from '@infra/http/interfaces/controller'
import z from 'zod'

export class UpdateOrganizationValidation implements IValidation {
  params: IValidator<Pick<UpdateOrganizationInput, 'slug'>> = z.object({
    slug: z.string({ message: 'Slug inválido' }).min(1, 'Slug é obrigatório'),
  })
  body: IValidator<Omit<UpdateOrganizationInput, 'slug'>> = z.object({
    name: z.string({ message: 'Nome inválido' }).optional(),
    avatarUrl: z
      .string({ message: 'Avatar inválido' })
      .url('Avatar deve ser uma URL válida')
      .optional(),
    shouldAttachUserByDomain: z.boolean({ message: 'Deve ser verdadeiro ou falso' }).optional(),
  })
}
