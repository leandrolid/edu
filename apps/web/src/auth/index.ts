import { CookiesFn, getCookie as getCookieFn, deleteCookie as deleteCookieFn } from 'cookies-next'

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

const getCookie = async (key: string) => {
  let cookieStore: CookiesFn | undefined
  if (typeof window === 'undefined') {
    const { cookies: serverCookies } = await import('next/headers')
    cookieStore = serverCookies
  }
  return getCookieFn(key, { cookies: cookieStore })
}

const deleteCookie = async (key: string) => {
  let cookieStore: CookiesFn | undefined
  if (typeof window === 'undefined') {
    const { cookies: serverCookies } = await import('next/headers')
    cookieStore = serverCookies
  }
  return deleteCookieFn(key, { cookies: cookieStore })
}
