import { CreateOrganizationInput } from '@app/organizations/create-organization/create-organization.input'
import { IValidation, IValidator } from '@infra/http/interfaces/controller'
import z from 'zod'

export class CreateOrganizationValidation implements IValidation {
  body?: IValidator<CreateOrganizationInput> = z.object({
    name: z.string({ message: 'Nome inválido' }),
    slug: z.string({ message: 'O slug é obrigatório' }),
    domain: z
      .string({ message: 'O domínio é inválido' })
      .refine(
        (value) => {
          const domainRegex = /^[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
          return domainRegex.test(value)
        },
        { message: 'O domínio é inválido' },
      )
      .nullable(),
    avatarUrl: z
      .string({ message: 'O avatar é inválido' })
      .url({ message: 'O avatar é inválido' })
      .nullable(),
    shouldAttachUserByDomain: z.boolean({ message: 'O campo deve ser verdadeiro ou falso' }),
  })
}
