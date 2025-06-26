import { GetMembersInput } from '@app/usecases/members/get-members/get-members.input'
import type { IValidation, IValidator } from '@edu/framework'
import { slugSchema } from '@infra/http/controllers/organizations/get-organization/get-organization.validation'
import z from 'zod'

export class GetMembersValidation implements IValidation {
  params?: IValidator<Pick<GetMembersInput, 'slug' | 'team'>> = z.object({
    slug: slugSchema,
    team: z.string({ message: 'Time inválido' }).min(1, { message: 'Time é obrigatório' }),
  })

  query?: IValidator<Omit<GetMembersInput, 'slug' | 'team'>> = z.object({
    page: z.coerce
      .number({ message: 'Página inválida' })
      .positive({ message: 'Página deve ser maior que 0' })
      .int({ message: 'Página deve ser um número inteiro' }),
    pageSize: z.coerce
      .number({ message: 'Limite inválido' })
      .positive({ message: 'Limite deve ser maior que 0' })
      .int({ message: 'Limite deve ser um número inteiro' })
      .optional()
      .default(10),
    search: z.string({ message: 'Busca inválida' }).optional(),
  })
}
