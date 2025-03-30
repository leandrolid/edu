export const ITokenService = Symbol('ITokenService')

export interface ITokenService {
  sign<T extends object>(
    payload: T,
    options: {
      expiresIn: ExpiresIn
    },
  ): Promise<string>
  verify<T>(token: string): Promise<Payload<T>>
}

export type ExpiresIn = `${number}${'s' | 'm' | 'h' | 'd' | 'w'}`

export type Payload<T = Record<string, unknown>> = {
  iat?: number
  exp?: number
} & {
  [Key in keyof T]: T[Key]
}
