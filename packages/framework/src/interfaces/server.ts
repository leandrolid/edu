import type { IErrorHandler } from './error-handler'
import type { Constructor } from './injection'

export type IServer = {
  start(port: number): Promise<void>
  cors(origins: string[]): void
  registerValidationProvider(): void
  registerControllers(controllers: Constructor[]): void
  registerErrorHandler(errorHandler: IErrorHandler): void
  registerDocs(): void
  registerProviders(providers: RegisterProviderInput): void
  registerMultipartForm(config?: MultipartFormConfig): void
}

export type MultipartFormConfig = {
  fileSize?: number
  files?: number
}

export type RegisterProviderInput = Array<
  Constructor | { provide: Constructor | string; useClass: Constructor }
>
