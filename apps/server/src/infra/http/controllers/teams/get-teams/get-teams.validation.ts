import type { GetTeamsInput } from '@app/usecases/teams/get-teams/get-teams.input'
import type { IValidation, IValidator } from '@edu/framework'
import z from 'zod'

export class GetTeamsValidation implements IValidation {
  query?: IValidator<GetTeamsInput> = z.object({
    page: z.coerce
      .number({ message: 'Página inválida' })
      .positive({ message: 'Página deve ser maior que 0' })
      .int({ message: 'Página deve ser um número inteiro' })
      .optional()
      .default(1),
    pageSize: z.coerce
      .number({ message: 'Limite inválido' })
      .positive({ message: 'Limite deve ser maior que 0' })
      .int({ message: 'Limite deve ser um número inteiro' })
      .optional()
      .default(100),
    search: z.string({ message: 'Busca inválida' }).optional(),
  })
}
