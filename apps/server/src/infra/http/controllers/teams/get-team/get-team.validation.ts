import type { GetTeamInput } from '@app/teams/get-team/get-team.input'
import type { IValidation, IValidator } from '@infra/http/interfaces/controller'
import z from 'zod'

export class GetTeamValidation implements IValidation {
  params?: IValidator<GetTeamInput> = z.object({
    teamId: z
      .string({ message: 'ID da equipe inválido' })
      .uuid({ message: 'ID da equipe deve ser um UUID válido' }),
    slug: z.string({ message: 'Slug inválido' }).min(1, { message: 'Slug não pode ser vazio' }),
  })
}
