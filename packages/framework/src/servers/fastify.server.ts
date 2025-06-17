import fastifyCors from '@fastify/cors'
import fastifySwagger from '@fastify/swagger'
import fastifySwaggerUI from '@fastify/swagger-ui'
import fastify from 'fastify'
import {
  jsonSchemaTransform,
  serializerCompiler,
  validatorCompiler,
  ZodTypeProvider,
} from 'fastify-type-provider-zod'
import { Container, Scope, type Constructor } from '../container'
import { Injectable } from '../decorators'
import type { IErrorHandler, IServer } from '../interfaces'
import { Logger } from '../utils'

const app = fastify().withTypeProvider<ZodTypeProvider>()

@Injectable({ scope: Scope.Singleton })
export class FastifyServer implements IServer {
  private readonly controllers: { route: string; method: string; tag: string }[] = []
  private readonly logger = new Logger('Server')

  public async start(port: number): Promise<void> {
    await app.listen({ port })
    this.controllers.forEach((controller) => {
      this.logger.warn(`[HTTP] ${controller.tag} { ${controller.route}, ${controller.method} }`)
    })
    this.logger.success(`Server running on port ${port}`)
  }

  public cors(origins: string[]): void {
    app.register(fastifyCors, {
      origin: origins,
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    })
  }

  public registerValidationProvider(): void {
    app.setSerializerCompiler(serializerCompiler)
    app.setValidatorCompiler(validatorCompiler)
  }

  public registerControllers(controllers: Constructor[]): void {
    controllers.forEach((controller) => {
      // prettier-ignore
      const { instance, prefix, route, docs, validation, middlewares } = Container.instance.resolveController(controller)
      const url = this.makePath(prefix, route.path)
      this.controllers.push({
        route: url,
        method: route.method.toUpperCase(),
        tag: docs?.tags?.at(0) || 'Untagged',
      })
      app.register(async (appInstance) => {
        appInstance
          .withTypeProvider<ZodTypeProvider>()
          .addHook('preHandler', async (request, response) => {
            return Promise.all(
              middlewares.map((middleware) => middleware.execute(request, response)),
            )
          })
          .route({
            url,
            method: route.method,
            schema: this.removeUndefined({
              security: [{ bearerAuth: [] }],
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

  public registerErrorHandler(handler: IErrorHandler): void {
    app.setErrorHandler((error, _request, reply) => handler.execute(error, reply))
  }

  public registerDocs(): void {
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
              description: 'JWT Bearer Token for authentication',
            },
          },
        },
        security: [{ bearerAuth: [] }],
      },
      transform: jsonSchemaTransform,
    })

    app.register(fastifySwaggerUI, {
      routePrefix: '/docs',
    })
  }

  public registerProviders(_providers: Constructor[]): void {}

  private makePath(prefix: string, path: string): string {
    return `/${[...prefix.split('/'), ...path.split('/')].filter(Boolean).join('/')}`
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
}
