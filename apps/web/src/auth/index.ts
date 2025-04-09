import { CookiesFn, getCookie as getCookieFn } from 'cookies-next'

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
}

const getCookie = async (key: string) => {
  let cookieStore: CookiesFn | undefined
  if (typeof window === 'undefined') {
    const { cookies: serverCookies } = await import('next/headers')
    cookieStore = serverCookies
  }
  return getCookieFn(key, { cookies: cookieStore })
}
