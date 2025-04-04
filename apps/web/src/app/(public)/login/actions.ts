'use server'

import { httpClient } from '@/http/client'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

export const loginWithEmailAndPassword = async (prevState: any, data: FormData) => {
  const { email, password } = Object.fromEntries(data)
  const res = await httpClient.request({
    url: 'auth/signin',
    method: 'POST',
    body: {
      email,
      password,
    },
  })
  const cookie = await cookies()
  cookie.set('token', res.data.token)
  redirect('/')
}
