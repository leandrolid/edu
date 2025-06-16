'use server'

import { auth } from '@/auth'
import { HttpError } from '@/http/errors/http.error'
import { updateOrganization } from '@/http/services/organizations/update-organization'
import { redirect } from 'next/navigation'
import { z } from 'zod'

export const updateOrganizationAction = async (data: FormData) => {
  const result = schema.safeParse(Object.fromEntries(data))
  if (!result.success) {
    return { success: false, message: null, errors: result.error.flatten().fieldErrors }
  }
  try {
    const slug = await auth.getCurrentOrganization()
    await updateOrganization({
      slug: slug!,
      name: result.data.name,
      domain: result.data.domain,
      shouldAttachUserByDomain: result.data.autoJoin,
    })
    return { success: true, message: null, errors: null }
  } catch (error) {
    if (error instanceof HttpError) {
      return { success: false, message: error.message, errors: error.errors }
    }
    console.error(error)
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

export const deleteOrganizationAction = async (slug: string) => {
  let success = false
  try {
    await new Promise((resolve, reject) => {
      setTimeout(() => {
        if (slug) {
          resolve(true)
        } else {
          reject('Organização não encontrada')
        }
      }, 1000)
    })
    success = true
  } catch (error) {
    if (error instanceof HttpError) {
      return { success: false, message: error.message, errors: error.errors }
    }
    console.error(error)
    return {
      success: false,
      message: 'Erro ao excluir a organização. Tente novamente mais tarde.',
      errors: null,
    }
  }
  if (!success) {
    return { success: false, message: 'Erro ao excluir a organização', errors: null }
  }
  return redirect('/')
}
