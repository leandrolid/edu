import type { ClientRequest, ServerResponse } from 'node:http'
import { Readable, Writable } from 'node:stream'

export interface IController {
  execute(...args: any[]): Promise<{
    message?: string
    data?: unknown
    metadata?: {
      page: number
      pageSize: number
      total: number
      totalPages: number
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
}

export interface IRequestNode extends IRequest, ClientRequest {}

export interface IResponse {
  status: (code: number) => this
  send: (data: any) => void
}

export interface IResponseNode extends IResponse, ServerResponse {}

export type IFile = {
  filename: string
  encoding: string
  mimetype: string
  toBuffer: () => Promise<Buffer>
  toStream: () => IReadStream
}

export type IReadStream = Readable & { bytesRead?: number }
export type IWriteStream = Writable
