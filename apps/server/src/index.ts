import '@infra/_injection/register'

import { Container } from '@infra/_injection'
import { BasicSignInController } from '@infra/http/controllers/auth/basic-sign-in/basic-sign-in.controller'
import { CreateOrganizationController } from '@infra/http/controllers/organizations/create-organization/create-organization.controller'
import { UpdateOrganizationController } from '@infra/http/controllers/organizations/update-organization/update-organization.controller'
import { CreateAccountController } from '@infra/http/controllers/users/create-account/create-account.controller'
import { HttpErrorHandler } from '@infra/http/errors/error.handler'
import { FastifyServer } from '@infra/http/servers/fastify.server'

const PORT = Number(process.env.PORT || 4001)
const app = Container.instance.resolve(FastifyServer)
app.cors()
app.registerValidationProvider()
app.registerDocs()
app.registerControllers([CreateAccountController])
app.registerControllers([BasicSignInController])
app.registerControllers([CreateOrganizationController, UpdateOrganizationController])
app.registerErrorHandler(new HttpErrorHandler())
app.start(PORT)
