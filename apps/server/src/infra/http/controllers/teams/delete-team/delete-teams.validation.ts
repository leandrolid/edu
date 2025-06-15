import type { DeleteTeamInput } from '@app/teams/delete-team/delete-team.input'
import type { IValidation, IValidator } from '@edu/framework'
import { slugSchema } from '@infra/http/controllers/organizations/get-organization/get-organization.validation'
import z from 'zod'

export class DeleteTeamValidation implements IValidation {
  params?: IValidator<DeleteTeamInput> = z.object({
    teamId: z
      .string({ message: 'ID do time é obrigatório' })
      .uuid({ message: 'ID do time deve ser um UUID válido' })
      .describe('ID do time a ser excluído'),
    slug: slugSchema,
  })
}
