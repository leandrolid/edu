import fastifyCors from '@fastify/cors'
import fastifySwagger from '@fastify/swagger'
import fastifySwaggerUI from '@fastify/swagger-ui'
import { Constructor, Container, Injectable, Scope } from '@infra/_injection'
import { IErrorHandler } from '@infra/http/interfaces/error-handler'
import { IServer } from '@infra/http/interfaces/server'
import { DefaultValidation } from '@infra/http/servers/fastify.validation'
import fastify from 'fastify'
import {
  jsonSchemaTransform,
  serializerCompiler,
  validatorCompiler,
  ZodTypeProvider,
} from 'fastify-type-provider-zod'

const app = fastify().withTypeProvider<ZodTypeProvider>()
const defaultValidation = new DefaultValidation()

@Injectable({ scope: Scope.Singleton })
export class FastifyServer implements IServer {
  async start(port: number): Promise<void> {
    await app.listen({ port })
    console.log(`Server running on port ${port}`)
  }

  cors(): void {
    app.register(fastifyCors, {
      origin: '*',
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    })
  }

  registerValidationProvider(): void {
    app.setSerializerCompiler(serializerCompiler)
    app.setValidatorCompiler(validatorCompiler)
  }

  registerControllers(controllers: Constructor[]): void {
    controllers.forEach((controller) => {
      // prettier-ignore
      const { instance, prefix, route, docs, validation, middlewares } = Container.instance.resolveController(controller)
      app.register(async (appInstance) => {
        appInstance
          .withTypeProvider<ZodTypeProvider>()
          .addHook('preHandler', async (request, response) => {
            return Promise.all(
              middlewares.map((middleware) => middleware.execute(request, response)),
            )
          })
          .route({
            url: this.makePath(prefix, route.path),
            method: route.method,
            schema: this.removeUndefined({
              body: validation.body,
              query: validation.query,
              params: validation.params,
              headers: validation.headers,
              summary: docs.title,
              description: docs.description,
              tags: docs.tags,
              response: docs.response,
            }),
            handler: async (request, response) => {
              const output = await Container.instance.resolveRouteHandler({
                instance,
                execute: route.execute,
                request,
                response,
              })
              return response.status(route.status).send(output)
            },
          })
      })
    })
  }

  private removeUndefined(obj: Record<string, unknown>): Record<string, unknown> {
    return Object.entries(obj).reduce(
      (acc, [key, value]) => {
        if (!value) return acc
        return { ...acc, [key]: value }
      },
      {} as Record<string, unknown>,
    )
  }

  registerErrorHandler(handler: IErrorHandler): void {
    app.setErrorHandler((error, _request, reply) => handler.execute(error, reply))
  }

  registerDocs(): void {
    app.register(fastifySwagger, {
      openapi: {
        info: {
          title: 'Edu API',
          description: 'Full-stack SaaS with multi-tenant & RBAC.',
          version: '1.0.0',
        },
        components: {
          securitySchemes: {
            bearerAuth: {
              type: 'http',
              scheme: 'bearer',
              bearerFormat: 'JWT',
            },
          },
        },
      },
      transform: jsonSchemaTransform,
    })

    app.register(fastifySwaggerUI, {
      routePrefix: '/docs',
    })
  }

  private makePath(prefix: string, path: string): string {
    return `/${[...prefix.split('/'), ...path.split('/')].filter(Boolean).join('/')}`
  }
}
