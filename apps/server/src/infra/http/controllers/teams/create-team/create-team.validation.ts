import type { CreateTeamInput } from '@app/teams/create-team/create-team.input'
import type { IValidation, IValidator } from '@edu/framework'
import { rbacRoleSchema, type RbacRole } from '@edu/rbac'
import z from 'zod'

export class CreateTeamValidation implements IValidation {
  body?: IValidator<CreateTeamInput> = z.object({
    name: z
      .string({ message: 'Nome é obrigatório' })
      .min(3, { message: 'Nome deve ter pelo menos 3 caracteres' }),
    description: z.string({ message: 'Descrição deve ser um texto' }).optional(),
    roles: z
      .array(
        z.custom<RbacRole>((value) => rbacRoleSchema.safeParse(value).success, {
          message: 'Permissão é obrigatória',
        }),
      )
      .min(1, { message: 'Selecione pelo menos uma permissão' }),
  })
}
