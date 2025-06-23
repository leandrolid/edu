import { CookiesFn, deleteCookie as deleteCookieFn, getCookie as getCookieFn } from 'cookies-next'

export const getCookie = async (key: string) => {
  let cookieStore: CookiesFn | undefined
  if (typeof window === 'undefined') {
    const { cookies: serverCookies } = await import('next/headers')
    cookieStore = serverCookies
  }
  return getCookieFn(key, { cookies: cookieStore })
}

export const deleteCookie = async (key: string) => {
  let cookieStore: CookiesFn | undefined
  if (typeof window === 'undefined') {
    const { cookies: serverCookies } = await import('next/headers')
    cookieStore = serverCookies
  }
  return deleteCookieFn(key, { cookies: cookieStore })
}
