import { HttpError } from '@/http/errors/http.error'
import { env } from '@edu/env'
import axios, { AxiosError } from 'axios'
import { CookiesFn, getCookie } from 'cookies-next'
import { HttpClient, HttpRequest } from './client'

const client = axios.create({
  baseURL: env.NEXT_PUBLIC_API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

class AxiosHttpClient implements HttpClient {
  async request<Body>(request: HttpRequest): Promise<Body> {
    try {
      await this.authorize(request)
      const response = await client.request({
        url: request.url,
        method: request.method,
        headers: request.headers,
        params: request.query,
        data: request.body,
        signal: request.signal,
        adapter: 'fetch',
      })
      return response.data
    } catch (error) {
      console.error('Error in request', error)
      if (error instanceof AxiosError && error.response) {
        throw new HttpError(
          error.response.status,
          error.response.data.message,
          error.response.data.errors,
        )
      }
      throw new HttpError(500, (error as any)?.message ?? 'Erro interno')
    }
  }

  onStatusCode(cb: (statusCode: number) => void): number {
    return client.interceptors.response.use(
      (response) => {
        cb(response.status)
        return Promise.resolve(response)
      },
      (error: AxiosError) => {
        cb(error.status ?? error.response!.status)
        return Promise.reject(error)
      },
    )
  }

  private async authorize(request: HttpRequest): Promise<void> {
    let cookieStore: CookiesFn | undefined
    if (typeof window === 'undefined') {
      const { cookies: serverCookies } = await import('next/headers')
      cookieStore = serverCookies
    }
    const token = await getCookie('token', { cookies: cookieStore })
    if (token) {
      Object.assign(request, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
    }
  }
}

export const httpClient: HttpClient = new AxiosHttpClient()
