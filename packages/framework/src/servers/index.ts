import { Container, type Constructor } from '../container'
import type { IErrorHandler } from '../interfaces'
import { FastifyServer } from './fastify.server'

export function createFastifyServer({
  providers,
  controllers,
  errorHandler,
  docs,
  zodValidation,
  cors,
}: {
  providers?: Constructor[]
  controllers?: Constructor[]
  errorHandler?: IErrorHandler
  docs?: boolean
  zodValidation?: boolean
  cors?: string[]
}): {
  start: (port: number) => Promise<void>
} {
  const app = Container.instance.resolve(FastifyServer)
  if (providers) app.registerProviders(providers)
  if (controllers) app.registerControllers(controllers)
  if (errorHandler) app.registerErrorHandler(errorHandler)
  if (docs) app.registerDocs()
  if (zodValidation) app.registerValidationProvider()
  if (cors) app.cors(cors)
  return app
}
