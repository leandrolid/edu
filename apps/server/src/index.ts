import 'reflect-metadata'

import { FastifyServer } from '@infra/http/servers/fastfy.server'
import { CreateAccountController } from '@infra/http/controllers/users/create-account.controller'
import { HttpErrorHandler } from '@infra/http/errors/error.handler'

const PORT = Number(process.env.PORT || 4000)
const app = new FastifyServer()
app.cors()
app.registerValidationProvider()
app.registerDocs()
app.registerControllers([CreateAccountController])
app.registerErrorHandler(new HttpErrorHandler())
app.start(PORT)
