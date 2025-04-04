import axios, { AxiosError } from 'axios'
import { HttpClient, HttpRequest } from './client'
import { cookies } from 'next/headers'
import { HttpError } from '@/http/errors/http.error'

const client = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

class AxiosHttpClient implements HttpClient {
  async request<Body>({
    url,
    method,
    headers = {},
    query = {},
    body,
  }: HttpRequest<Body>): Promise<Body> {
    try {
      const cookie = await cookies()
      const token = cookie.get('token')?.value
      const response = await client.request({
        url,
        method,
        headers: {
          Authorization: token ? `Bearer ${token}` : undefined,
          ...headers,
        },
        params: query,
        data: body,
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

  responseMiddleware(cb: (response: { status: number }) => void) {
    client.interceptors.response.use(
      (response) => {
        cb(response)
        return response
      },
      (error: AxiosError) => {
        cb(error.response!)
      },
    )
  }
}

export const httpClient: HttpClient = new AxiosHttpClient()
