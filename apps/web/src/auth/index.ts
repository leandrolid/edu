import { cookies } from 'next/headers'

export const auth = {
  async isAuthenticated() {
    const cookie = await cookies()
    return !!cookie.get('token')?.value
  },
}
