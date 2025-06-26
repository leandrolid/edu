import { CreateOrganizationInput } from '@app/usecases/organizations/create-organization/create-organization.input'
import type { IValidation, IValidator } from '@edu/framework'
import z from 'zod'

export class CreateOrganizationValidation implements IValidation {
  body?: IValidator<CreateOrganizationInput> = z.object({
    name: z.string({ message: 'Nome inválido' }),
    domain: z
      .string({ message: 'O domínio é inválido' })
      .toLowerCase()
      .nullable()
      .transform((val) => (val?.length ? val.trim() : null)),
    avatarUrl: z
      .string({ message: 'O avatar é inválido' })
      .url({ message: 'O avatar é inválido' })
      .nullable(),
    shouldAttachUserByDomain: z.boolean({ message: 'O campo deve ser verdadeiro ou falso' }),
  })
}
