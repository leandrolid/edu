import type { Constructor } from '../container'
import type { IErrorHandler } from './error-handler'

export type IServer = {
  start(port: number): Promise<void>
  cors(origins: string[]): void
  registerValidationProvider(): void
  registerControllers(controllers: Constructor[]): void
  registerErrorHandler(errorHandler: IErrorHandler): void
  registerDocs(): void
  registerProviders(providers: Constructor[]): void
}
