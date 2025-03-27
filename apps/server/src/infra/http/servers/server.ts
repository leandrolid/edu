import { Constructor } from '@infra/_injection'
import { IErrorHandler } from '@infra/http/interfaces/error.handler'

export type IServer = {
  cors(): void
  registerValidationProvider(): void
  registerControllers(controllers: Constructor[]): void
  registerErrorHandler(errorHandler: IErrorHandler): void
  start(port: number): Promise<void>
}
