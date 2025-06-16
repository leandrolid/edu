'use server'

import { HttpError } from '@/http/errors/http.error'
import {
  createOrganization,
  type CreateOrganizationOutput,
} from '@/http/services/organizations/create-organization'
import { redirect } from 'next/navigation'
import { z } from 'zod'

export const createOrganizationAction = async (data: FormData) => {
  const result = schema.safeParse(Object.fromEntries(data))
  if (!result.success) {
    return { success: false, message: null, errors: result.error.flatten().fieldErrors }
  }
  let response: CreateOrganizationOutput
  try {
    response = await createOrganization(result.data)
  } catch (error) {
    if (error instanceof HttpError) {
      return { success: false, message: error.message, errors: error.errors }
    }
    console.error(error)
    return { success: false, message: 'Por favor, tente novamente mais tarde.', errors: null }
  }
  if (!response) {
    return { success: false, message: 'Por favor, tente novamente mais tarde.', errors: null }
  }
  return redirect(`/${response.data.slug}`)
}

const schema = z.object({
  name: z
    .string({ message: 'Nome é obrigatório' })
    .min(3, { message: 'Nome deve ter pelo menos 3 caracteres' }),
  slug: z
    .string({ message: 'Slug é obrigatório' })
    .min(3, { message: 'Slug deve ter pelo menos 3 caracteres' })
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, {
      message: 'Slug deve conter apenas letras minúsculas, números e hífens',
    }),
  domain: z.string({ message: 'Domínio é obrigatório' }).nullable(),
  shouldAttachUserByDomain: z
    .any()
    .transform((value) => value === 'on')
    .optional()
    .default(false),
  avatarUrl: z.string().nullable(),
})
