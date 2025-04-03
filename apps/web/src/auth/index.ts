import { cookies } from 'next/headers'

export const isAuthenticated = async () => {
  const cookie = await cookies()
  return !!cookie.get('token')?.value
}
