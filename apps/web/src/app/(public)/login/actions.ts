'use server'

import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

export const loginWithEmailAndPassword = async (data: FormData) => {
  const { email, password } = Object.fromEntries(data)
  const res = await fetch('http://localhost:3333/auth/signin', {
    method: 'POST',
    body: JSON.stringify({
      email,
      password,
    }),
    headers: {
      'Content-Type': 'application/json',
    },
  })
  const json = await res.json()
  const cookie = await cookies()
  cookie.set('token', json.data.token)
  redirect('/')
}
