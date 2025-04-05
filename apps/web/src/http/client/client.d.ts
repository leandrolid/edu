export type HttpClient = {
  request: <Body>(params: HttpRequest) => Promise<Body>
  responseMiddleware: (cb: (response: { status: number }) => void) => void
}

export type HttpRequest = {
  url: string
  method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE'
  headers?: Record<string, string>
  query?: Record<string, any>
  body?: any
  signal?: AbortSignal
  submenu?: 'desafios'
}
