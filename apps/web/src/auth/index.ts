import { getCookie } from 'cookies-next'
import { cookies } from 'next/headers'

export const auth = {
  async isAuthenticated() {
    const cookie = await cookies()
    return !!cookie.get('token')?.value
  },
  async getCurrentOrganization(): Promise<string | undefined> {
    const slug = await getCookie('slug', { cookies })
    return slug
  },
}
