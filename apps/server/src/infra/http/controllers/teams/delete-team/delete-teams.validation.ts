import type { DeleteTeamInput } from '@app/teams/delete-team/delete-team.input'
import type { IValidation, IValidator } from '@infra/http/interfaces/controller'
import z from 'zod'

export class DeleteTeamValidation implements IValidation {
  params?: IValidator<DeleteTeamInput> = z.object({
    teamId: z
      .string({ message: 'ID do time é obrigatório' })
      .uuid({ message: 'ID do time deve ser um UUID válido' })
      .describe('ID do time a ser excluído'),
    slug: z
      .string({ message: 'Slug da organização é obrigatório' })
      .min(1, { message: 'Slug da organização não pode ser vazio' })
      .describe('Slug da organização a qual o time pertence'),
  })
}
