import fastifyCors from '@fastify/cors'
import { Constructor, Container } from '@infra/_injection'
import { IServer } from '@infra/http/servers/server'
import fastify from 'fastify'
import { serializerCompiler, validatorCompiler, ZodTypeProvider } from 'fastify-type-provider-zod'

const app = fastify().withTypeProvider<ZodTypeProvider>()

export class FastifyServer implements IServer {
  cors(): void {
    app.register(fastifyCors)
  }

  registerValidationProvider(): void {
    app.setSerializerCompiler(serializerCompiler)
    app.setValidatorCompiler(validatorCompiler)
  }

  registerControllers(controllers: Constructor[]): void {
    controllers.forEach((controller) => {
      const { instance, prefix, routes } = Container.instance.resolveController(controller)
      routes.forEach((route) => {
        app.register(async (appInstance) => {
          appInstance.withTypeProvider<ZodTypeProvider>().route({
            url: this.makePath(prefix, route.path),
            method: route.method,
            schema: instance.validation,
            handler: async (request, reply) => {
              return instance[route.execute](request, reply)
            },
          })
        })
      })
    })
  }

  async start(port: number): Promise<void> {
    await app.listen({ port })
    console.log(app.printRoutes())
    console.log(`Server running on port ${port}`)
  }

  private makePath(prefix: string, path: string): string {
    return `/${[...prefix.split('/'), ...path.split('/')].filter(Boolean).join('/')}`
  }
}
