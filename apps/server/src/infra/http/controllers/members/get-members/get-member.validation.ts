import { GetMembersInput } from '@app/members/get-members/get-members.input'
import { IValidation, IValidator } from '@infra/http/interfaces/controller'
import z from 'zod'

export class GetMembersValidation implements IValidation {
  params?: IValidator<Pick<GetMembersInput, 'slug'>> = z.object({
    slug: z.string({ message: 'Slug inválido' }).min(1, 'Slug é obrigatório'),
  })

  query?: IValidator<Omit<GetMembersInput, 'slug'>> = z.object({
    teamId: z.string({ message: 'Time inválido' }).uuid({ message: 'Time deve ser um UUID' }),
    page: z.coerce
      .number({ message: 'Página inválida' })
      .positive({ message: 'Página deve ser maior que 0' })
      .int({ message: 'Página deve ser um número inteiro' }),
    limit: z.coerce
      .number({ message: 'Limite inválido' })
      .positive({ message: 'Limite deve ser maior que 0' })
      .int({ message: 'Limite deve ser um número inteiro' })
      .optional()
      .default(10),
    search: z.string({ message: 'Busca inválida' }).optional(),
  })
}
