import { HttpError } from '@/http/errors/http.error'
import { getCookie } from '@/lib/cookies-next'
import { env } from '@edu/env'
import axios, { AxiosError, toFormData } from 'axios'
import { HttpClient, HttpRequest } from './client'

const client = axios.create({
  baseURL: env.NEXT_PUBLIC_API_URL,
})

export class AxiosHttpClient implements HttpClient {
  async request<Body>({
    onUploadProgress,
    responseType,
    ...request
  }: HttpRequest & {
    responseType?: 'json' | 'text' | 'stream' | 'blob'
  }): Promise<Body> {
    try {
      const response = await client.request({
        url: request.url,
        method: request.method,
        headers: await this.authorize(request.headers),
        params: request.query,
        data: request.multipartForm ? toFormData(request.body) : request.body,
        signal: request.signal,
        adapter: onUploadProgress ? axios.defaults.adapter : 'fetch',
        onUploadProgress: (progressEvent) => {
          if (!onUploadProgress) return
          onUploadProgress({ progress: progressEvent.progress ?? 0 })
        },
        responseType,
      })
      return response.data
    } catch (error) {
      console.error('[HTTP]:', error)
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

  async stream(request: HttpRequest): Promise<ReadableStream> {
    return this.request({
      ...request,
      responseType: 'stream',
    })
  }

  async save(request: HttpRequest): Promise<Blob> {
    return this.request({
      ...request,
      responseType: 'blob',
    })
  }

  onStatusCode(cb: (statusCode: number) => void): number {
    return client.interceptors.response.use(
      (response) => {
        cb(response.status)
        return Promise.resolve(response)
      },
      (error: AxiosError) => {
        cb(error.status ?? error.response?.status!)
        return Promise.reject(error)
      },
    )
  }

  private async authorize(headers?: Record<string, string>): Promise<Record<string, string>> {
    const token = await getCookie('token')
    if (!token) return headers || {}
    return {
      ...(headers || {}),
      Authorization: `Bearer ${token}`,
    }
  }
}
