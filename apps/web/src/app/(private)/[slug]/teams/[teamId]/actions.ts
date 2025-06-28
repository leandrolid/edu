'use server'

import { auth } from '@/auth'
import { HttpError } from '@/http/errors/http.error'
import { updateTeam } from '@/http/services/teams/update-team'
import { PERMISSIONS_DESCRIPTION } from '@edu/utils'
import { formToJSON } from 'axios'
import { z } from 'zod'

export async function updateTeamAction(formData: FormData) {
  try {
    const team = formToJSON(formData) as Data
    const result = schema.safeParse({
      teamId: team.teamId,
      name: team.name,
      description: team.description,
      roles: Array.isArray(team.roles)
        ? team.roles.flat(PERMISSIONS_DESCRIPTION.length)
        : [team.roles],
      updateAllMembers: String(team.updateAllMembers) === 'on',
    })
    const slug = await auth.getCurrentOrganization()
    if (!result.success) {
      return { success: false, message: null, errors: result.error.flatten().fieldErrors }
    }
    await updateTeam({
      slug: slug!,
      ...result.data,
    })
    return { success: true, message: null, errors: null }
  } catch (error) {
    if (error instanceof HttpError) {
      return { success: false, message: error.message, errors: error.errors || null }
    }
    return { success: false, message: 'Por favor, tente novamente mais tarde.', errors: null }
  }
}

const schema = z.object({
  teamId: z
    .string({ message: 'ID do time é obrigatório' })
    .uuid({ message: 'ID do time deve ser um UUID válido' }),
  name: z
    .string({ message: 'Nome é obrigatório' })
    .min(3, { message: 'Nome deve ter pelo menos 3 caracteres' }),
  description: z.string({ message: 'Descrição deve ser um texto' }).optional(),
  roles: z
    .array(z.string({ message: 'Permissão é obrigatória' }), { message: 'Permissão é obrigatória' })
    .min(1, { message: 'Selecione pelo menos uma permissão' }),
  updateAllMembers: z.boolean({ message: 'Opção inválida' }).optional().default(false),
})

type Data = z.infer<typeof schema>
