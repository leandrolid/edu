import { auth } from '@/auth'
import { HttpError } from '@/http/errors/http.error'
import { updateOrganization } from '@/http/services/organizations/update-organization'
import { z } from 'zod'

export const updateOrganizationAction = async (data: FormData) => {
  const result = schema.safeParse(Object.fromEntries(data))
  if (!result.success) {
    return { success: false, message: null, errors: result.error.flatten().fieldErrors }
  }
  try {
    const org = await auth.getCurrentOrganization()
    await updateOrganization({
      org: org!,
      name: result.data.name,
      domain: result.data.domain,
      shouldAttachUserByDomain: result.data.autoJoin,
    })
    return { success: true, message: null, errors: null }
  } catch (error) {
    console.error(error)
    if (error instanceof HttpError) {
      return { success: false, message: error.message, errors: error.errors }
    }
    return { success: false, message: 'Por favor, tente novamente mais tarde.', errors: null }
  }
}

const schema = z.object({
  name: z
    .string({ message: 'Nome é obrigatório' })
    .min(3, { message: 'Nome deve ter pelo menos 3 caracteres' }),
  domain: z.string({ message: 'Domínio é obrigatório' }).nullable(),
  autoJoin: z
    .any()
    .transform((value) => value === 'on')
    .optional()
    .default(false),
})
