export interface IController {
  execute(...args: any[]): Promise<{
    data: unknown
    metadata?: {
      page?: number
      perPage?: number
      totalItems?: number
      totalPages?: number
    }
  }>
}

export interface IValidation<B = unknown, Q = unknown, P = unknown, H = unknown> {
  body?: IValidator<B>
  query?: IValidator<Q>
  params?: IValidator<P>
  headers?: IValidator<H>
}

export interface IValidator<T = unknown> {
  parse: (data: unknown) => T
}

export interface IRequest<B = unknown, Q = unknown, P = unknown, H = unknown> {
  body: B
  query: Q
  params: P
  headers: H
  jwtVerify: <T>() => Promise<T>
}

export interface IResponse {
  status: (code: number) => this
  send: (data: any) => void
  jwtSign: <T>(payload: T, options?: any) => Promise<string>
}
