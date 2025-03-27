import 'reflect-metadata'

import { FastifyServer } from '@infra/http/servers/fastfy.server'
import { CreateAccountController } from '@infra/http/controllers/users/create-account.controller'

const PORT = Number(process.env.PORT || 4000)
const app = new FastifyServer()
app.cors()
app.registerValidationProvider()
app.registerControllers([CreateAccountController])
app.start(PORT)
