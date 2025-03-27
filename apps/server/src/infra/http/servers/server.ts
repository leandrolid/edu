import { Constructor } from '@infra/_injection'

export type IServer = {
  cors(): void
  registerValidationProvider(): void
  registerControllers(controllers: Constructor[]): void
  start(port: number): Promise<void>
}
