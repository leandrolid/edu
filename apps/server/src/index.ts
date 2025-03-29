import 'reflect-metadata'

import { BasicSignInController } from '@infra/http/controllers/auth/basic-signin/basic-signin.controller'
import { CreateAccountController } from '@infra/http/controllers/users/create-account/create-account.controller'
import { HttpErrorHandler } from '@infra/http/errors/error.handler'
import { FastifyServer } from '@infra/http/servers/fastfy.server'

const PORT = Number(process.env.PORT || 4000)
const app = new FastifyServer()
app.cors()
app.registerValidationProvider()
app.registerDocs()
app.registerControllers([CreateAccountController])
app.registerControllers([BasicSignInController])
app.registerErrorHandler(new HttpErrorHandler())
app.start(PORT)
