import type { GetTeamInput } from '@app/teams/get-team/get-team.input'
import type { IValidation, IValidator } from '@edu/framework'
import { slugSchema } from '@infra/http/controllers/organizations/get-organization/get-organization.validation'
import z from 'zod'

export class GetTeamValidation implements IValidation {
  params?: IValidator<GetTeamInput> = z.object({
    teamId: z
      .string({ message: 'ID do time inválido' })
      .uuid({ message: 'ID do time deve ser um UUID válido' }),
    slug: slugSchema,
  })
}
