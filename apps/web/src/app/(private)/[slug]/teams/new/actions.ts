'use server'

import { auth } from '@/auth'
import { PERMISSIONS_DESCRIPTION } from '@edu/utils'
import { formToJSON } from 'axios'
import { z } from 'zod'

export async function createTeamAction(formData: FormData) {
  try {
    const slug = await auth.getCurrentOrganization()
    const team = formToJSON(formData) as Data
    const result = schema.safeParse({
      name: team.name,
      description: team.description,
      roles: Array.isArray(team.roles)
        ? team.roles.flat(PERMISSIONS_DESCRIPTION.length)
        : [team.roles],
    })
    console.log({
      slug,
      data: result.data,
    })
    if (!result.success) {
      return { success: false, message: null, errors: result.error.flatten().fieldErrors }
    }
    return { success: true, message: null, errors: null }
  } catch (error) {
    console.error(error)
    return { success: false, message: 'Por favor, tente novamente mais tarde.', errors: null }
  }
}

const schema = z.object({
  name: z
    .string({ message: 'Nome é obrigatório' })
    .min(3, { message: 'Nome deve ter pelo menos 3 caracteres' }),
  description: z.string({ message: 'Descrição deve ser um texto' }).optional(),
  roles: z
    .array(z.string({ message: 'Permissão é obrigatória' }), { message: 'Permissão é obrigatória' })
    .min(1, { message: 'Selecione pelo menos uma permissão' }),
})

type Data = z.infer<typeof schema>
