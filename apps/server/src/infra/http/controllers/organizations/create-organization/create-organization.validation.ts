import { CreateOrganizationInput } from '@app/organizations/create-organization/create-organization.input'
import { IValidation, IValidator } from '@infra/http/interfaces/controller'
import z from 'zod'

export class CreateOrganizationValidation implements IValidation {
  body?: IValidator<CreateOrganizationInput> = z.object({
    name: z.string({ message: 'Nome inválido' }),
    slug: z.string({ message: 'O slug é obrigatório' }),
    domain: z
      .string({ message: 'O domínio é obrigatório' })
      .url({ message: 'O domínio é inválido' }),
    avatarUrl: z
      .string({ message: 'A logo é obrigatória' })
      .url({ message: 'A logo é inválida' })
      .nullable(),
    shouldAttachUserByDomain: z.boolean({ message: 'O campo deve ser um booleano' }),
  })
}
