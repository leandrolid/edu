import { deleteCookie, getCookie } from '@/lib/cookies-next'

export const auth = {
  async isAuthenticated() {
    const token = await getCookie('token')
    return !!token
  },
  async getCurrentOrganization(): Promise<string | undefined> {
    const slug = await getCookie('slug')
    return slug
  },
  async getToken(): Promise<string | undefined> {
    const token = await getCookie('token')
    return token
  },
  async signOut() {
    await deleteCookie('token')
    await deleteCookie('slug')
  },
}
