export type HttpClient = {
  request: <Body>(params: HttpRequest) => Promise<Body>
  stream: (params: HttpRequest) => Promise<ReadableStream>
  save: (params: HttpRequest) => Promise<Blob>
  onStatusCode: (cb: (statusCode: number) => void) => number
}

export type HttpRequest = {
  url: string
  method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE'
  headers?: Record<string, string>
  query?: Record<string, any>
  body?: any
  signal?: AbortSignal
  multipartForm?: boolean
  onUploadProgress?: (input: { progress: number }) => void
}
