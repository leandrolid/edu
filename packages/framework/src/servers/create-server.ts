import { Container } from '../container'
import { registerListeners } from '../container/register-listeners'
import { registerProviders } from '../container/register-providers'
import type { Constructor, IErrorHandler, MultipartFormConfig, Provider } from '../interfaces'
import { FastifyServer } from './fastify.server'

export function createServer({
  implementation = 'fastify',
  providers,
  controllers,
  errorHandler,
  docs,
  zodValidation,
  cors,
  multipartForm,
}: {
  implementation?: 'fastify'
  providers?: Provider[]
  controllers?: Constructor[]
  errorHandler?: IErrorHandler
  docs?: boolean
  zodValidation?: boolean
  cors?: string[]
  multipartForm?: MultipartFormConfig
}): {
  start: (port: number) => Promise<void>
} {
  const app = getServerImplementation(implementation)
  if (cors) app.cors(cors)
  if (zodValidation) app.registerValidationProvider()
  if (multipartForm) app.registerMultipartForm(multipartForm)
  if (docs) app.registerDocs()
  if (providers) registerProviders(providers)
  if (controllers) app.registerControllers(controllers)
  if (errorHandler) app.registerErrorHandler(errorHandler)
  registerListeners(providers)
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
