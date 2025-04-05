'use server'

import { HttpError } from '@/http/errors/http.error'
import { loginWithPassword } from '@/http/services/auth/login-with-password'
import { cookies } from 'next/headers'
import { z } from 'zod'

export const loginWithPasswordAction = async (prevState: any, data: FormData) => {
  const result = schema.safeParse(Object.fromEntries(data))
  if (!result.success) {
    return { success: false, message: null, errors: result.error.flatten().fieldErrors }
  }
  try {
    const response = await loginWithPassword(result.data)
    const cookie = await cookies()
    cookie.set('token', response.data.token)
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
  email: z.string({ message: 'Email é obrigatório' }).email({ message: 'Email inválido' }),
  password: z
    .string({ message: 'Senha é obrigatória' })
    .min(8, { message: 'Senha deve ter pelo menos 8 caracteres' }),
})
