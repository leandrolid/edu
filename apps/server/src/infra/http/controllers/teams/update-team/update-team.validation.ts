import type { UpdateTeamInput } from '@app/usecases/teams/update-team/update-team.input'
import type { IValidation, IValidator } from '@edu/framework'
import { rbacRoleSchema, type RbacRole } from '@edu/rbac'
import { slugSchema } from '@infra/http/controllers/organizations/get-organization/get-organization.validation'
import z from 'zod'

export class UpdateTeamValidation implements IValidation {
  params?: IValidator<Pick<UpdateTeamInput, 'teamId'>> = z.object({
    slug: slugSchema,
    teamId: z.string({ message: 'ID da equipe é obrigatório' }).uuid({
      message: 'ID da equipe deve ser um UUID válido',
    }),
  })

  body?: IValidator<Omit<UpdateTeamInput, 'teamId'>> = z.object({
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
    updateAllMembers: z.boolean({ message: 'Opção inválida' }).optional().default(false),
  })
}
