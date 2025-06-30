import fastifyCors from '@fastify/cors'
import fastifyMultipart, { type Multipart } from '@fastify/multipart'
import fastifySwagger from '@fastify/swagger'
import fastifySwaggerUI from '@fastify/swagger-ui'
import fastify from 'fastify'
import {
  hasZodFastifySchemaValidationErrors,
  jsonSchemaTransform,
  serializerCompiler,
  validatorCompiler,
  ZodTypeProvider,
} from 'fastify-type-provider-zod'
import { construct } from 'radash'
import { resolveController } from '../container/resolve-controller'
import { resolveRouteHandler } from '../container/resolve-controller-handler'
import { Injectable } from '../decorators'
import { Scope } from '../enums'
import { UnprocessableEntityError } from '../errors'
import type { Constructor, IErrorHandler, IFile, IServer, MultipartFormConfig } from '../interfaces'
import { FormFile, Logger } from '../utils'
import { makePath } from '../utils/make-path'
import { removeUndefined } from '../utils/remove-undefined'

const app = fastify().withTypeProvider<ZodTypeProvider>()

@Injectable({ scope: Scope.Singleton })
export class FastifyServer implements IServer {
  private readonly controllers: { route: string; method: string; tag: string }[] = []
  private readonly logger = new Logger('Server')

  public async start(port: number): Promise<void> {
    const host = await app.listen({ port, host: '0.0.0.0' })
    this.controllers.forEach((controller) => {
      this.logger.warn(`[HTTP] ${controller.tag} { ${controller.route}, ${controller.method} }`)
    })
    this.logger.success(`Server running on ${host}`)
  }

  public cors(origins: string[]): void {
    app.register(fastifyCors, {
      origin: origins,
      methods: ['*'],
    })
  }

  public registerValidationProvider(): void {
    app.setSerializerCompiler(serializerCompiler)
    app.setValidatorCompiler(validatorCompiler)
  }

  public registerControllers(controllers: Constructor[]): void {
    controllers.forEach((controller) => {
      const { instance, prefix, route, docs, validation, middlewares, isStream } =
        resolveController(controller)
      const url = makePath(prefix, route.path)
      this.controllers.push({
        route: url,
        method: route.method.toUpperCase(),
        tag: docs?.tags?.at(0) || 'Untagged',
      })
      app.register(async (appInstance) => {
        appInstance
          .withTypeProvider<ZodTypeProvider>()
          .addHook('preHandler', async (request, response) => {
            for (const middleware of middlewares) {
              await middleware.execute(request, response)
            }
          })
          .addHook('preValidation', async (request) => {
            if (request.isMultipart()) {
              request.body = this.formatFormData(request.body as Record<string, unknown>)
            }
          })
          .route({
            url,
            method: route.method,
            schema: removeUndefined({
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
            handler: async (requestInput, response) => {
              const output = await resolveRouteHandler({
                instance,
                execute: route.execute,
                request: {
                  ...requestInput,
                  headers: requestInput.headers,
                  query: requestInput.query,
                  params: requestInput.params,
                  body: requestInput.body,
                },
                requestNode: requestInput.raw,
                response,
                responseNode: response.raw,
              })
              if (!isStream) return response.status(route.status).send(output)
            },
          })
      })
    })
  }

  public registerErrorHandler(handler: IErrorHandler): void {
    app.setErrorHandler((error: Error, _request, res) => {
      let newError = error
      if (hasZodFastifySchemaValidationErrors(error)) {
        newError = new UnprocessableEntityError(
          'Erro de validação',
          error.validation.reduce(
            (acc, validation) => ({
              ...acc,
              [validation.instancePath.replace('/', '')]: [validation.message],
            }),
            {},
          ),
        )
      }
      return handler.execute(newError, res)
    })
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

  public registerMultipartForm(config?: MultipartFormConfig): void {
    app.register(fastifyMultipart, {
      limits: config,
      attachFieldsToBody: true,
      preservePath: true,
    })
  }

  private formatFormData(body: Record<string, unknown>) {
    return construct(
      Object.entries(body).reduce(
        (acc, [key, value]) => {
          if (Array.isArray(value)) {
            acc[key] = value.map((item) => this.getMultipartFormHelper(item))
          } else {
            acc[key] = this.getMultipartFormHelper(value as Multipart)
          }
          return acc
        },
        {} as Record<string, unknown>,
      ),
    )
  }

  private getMultipartFormHelper(
    field: Multipart | Multipart[] | undefined,
  ): IFile | IFile[] | unknown | undefined {
    if (!field) return undefined
    if (Array.isArray(field)) {
      return field.map((item) => this.getMultipartFormHelper(item))
    }
    if (field.type === 'field') {
      return field.value
    }
    return new FormFile(field)
  }
}
