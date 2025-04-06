import { UnauthorizedError } from '@domain/errors/unauthorized.error'
import { ExpiresIn, ITokenService, Payload } from '@domain/services/token.service'
import { env } from '@edu/env'
import { Injectable } from '@infra/_injection'
import crypto from 'node:crypto'

@Injectable({
  token: 'ITokenService',
})
export class TokenService implements ITokenService {
  async sign<T extends object>(
    payload: T,
    options: {
      expiresIn: ExpiresIn
    },
  ): Promise<string> {
    const header: Header = { alg: 'HS256', typ: 'JWT' }
    const iat = Math.floor(Date.now() / 1000)
    const exp = iat + this.getMilisecondsFromString(options.expiresIn)
    const payloadWithExp = { ...payload, iat, exp }
    const encodedHeader = await this.base64UrlEncode(JSON.stringify(header))
    const encodedPayload = await this.base64UrlEncode(JSON.stringify(payloadWithExp))
    const data = `${encodedHeader}.${encodedPayload}`
    const signature = crypto
      .createHmac('sha256', env.JWT_SECRET)
      .update(data)
      .digest('base64')
      .replace(/=+$/, '')
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
    return `${data}.${signature}`
  }

  async verify<T>(token: string): Promise<Payload<T>> {
    const [encodedHeader, encodedPayload, signature] = token.split('.')
    if (!encodedHeader || !encodedPayload || !signature) {
      throw new UnauthorizedError('Token invalido')
    }
    const data = `${encodedHeader}.${encodedPayload}`
    const expectedSignature = crypto
      .createHmac('sha256', env.JWT_SECRET)
      .update(data)
      .digest('base64')
      .replace(/=+$/, '')
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
    if (signature !== expectedSignature) {
      throw new UnauthorizedError('Assinatura inválida')
    }
    const payload: Payload<T> = await this.decode(token)
    if (!payload) {
      throw new UnauthorizedError('Dados inválidos')
    }
    if (payload.exp && payload.exp < Math.floor(Date.now() / 1000)) {
      throw new UnauthorizedError('Token expirado')
    }
    return payload
  }

  async decode<T>(token: string): Promise<T> {
    const [_, encodedPayload] = token.split('.')
    if (!encodedPayload) {
      throw new UnauthorizedError('Dados inválidos')
    }
    try {
      return JSON.parse(await this.base64UrlDecode(encodedPayload))
    } catch (error) {
      console.error(error)
      throw new UnauthorizedError('Dados inválidos')
    }
  }

  private async base64UrlEncode(input: string): Promise<string> {
    return Buffer.from(input, 'utf8')
      .toString('base64')
      .replace(/=+$/, '')
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
  }

  private async base64UrlDecode(input: string): Promise<string> {
    input = input.replace(/-/g, '+').replace(/_/g, '/')
    while (input.length % 4) {
      input += '='
    }
    return Buffer.from(input, 'base64').toString('utf8')
  }

  private getMilisecondsFromString(str: ExpiresIn): number {
    const value = parseInt(str.slice(0, -1), 10)
    const unit = str.slice(-1)
    switch (unit) {
      case 's':
        return value
      case 'm':
        return value * 60
      case 'h':
        return value * 60 * 60
      case 'd':
        return value * 24 * 60 * 60
      case 'w':
        return value * 7 * 24 * 60 * 60
      default:
        throw new UnauthorizedError('Expiração inválida')
    }
  }
}

type Header = {
  alg: string
  typ: string
}
