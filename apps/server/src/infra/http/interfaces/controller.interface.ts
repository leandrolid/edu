export interface IController {
  validation: IValidation
  execute(req: IRequest, res: IResponse): Promise<void>
}

export interface IValidation<B = unknown, Q = unknown, P = unknown, H = unknown> {
  body?: IValidator<B>
  query?: IValidator<Q>
  params?: IValidator<P>
  headers?: IValidator<H>
}

interface IValidator<T = unknown> {
  parse: (data: unknown) => T
}

export interface IRequest<B = unknown, Q = unknown, P = unknown, H = unknown> {
  body: B
  query: Q
  params: P
  headers: H
}

export interface IResponse {
  status: (code: number) => this
  send: (data: any) => void
}
