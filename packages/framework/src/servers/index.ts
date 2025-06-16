import { Container, type Constructor } from '../container'
import type { IErrorHandler } from '../interfaces'
import { FastifyServer } from './fastify.server'

export function createServer({
  implementation = 'fastify',
  providers,
  controllers,
  errorHandler,
  docs,
  zodValidation,
  cors,
}: {
  implementation?: 'fastify'
  providers?: Constructor[]
  controllers?: Constructor[]
  errorHandler?: IErrorHandler
  docs?: boolean
  zodValidation?: boolean
  cors?: string[]
}): {
  start: (port: number) => Promise<void>
} {
  const app = getServerImplementation(implementation)
  if (cors) app.cors(cors)
  if (zodValidation) app.registerValidationProvider()
  if (docs) app.registerDocs()
  if (providers) app.registerProviders(providers)
  if (controllers) app.registerControllers(controllers)
  if (errorHandler) app.registerErrorHandler(errorHandler)
  return app
}

function getServerImplementation(implementation: 'fastify') {
  switch (implementation) {
    case 'fastify':
      return Container.instance.resolve(FastifyServer)
    default:
      throw new Error(`Unsupported server implementation: ${implementation}`)
  }
}
