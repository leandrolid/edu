export type HttpClient = {
  request: <Body>(params: HttpRequest<Body>) => Promise<HttpResponse<Body>>
  responseMiddleware: (cb: (response: { status: number }) => void) => void
}

export type HttpRequest<T> = {
  url: string
  method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE'
  headers?: Record<string, string>
  query?: Record<string, any>
  body?: any
  signal?: AbortSignal
  submenu?: 'desafios'
}
