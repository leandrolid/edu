import fastifyCors from '@fastify/cors'
import fastify from 'fastify'
import {
  // jsonSchemaTransform,
  serializerCompiler,
  validatorCompiler,
  ZodTypeProvider,
} from 'fastify-type-provider-zod'
import { createUserController } from './controllers/users/create-account.controller'

const PORT = Number(process.env.PORT || 4000)

const app = fastify().withTypeProvider<ZodTypeProvider>()
app.setSerializerCompiler(serializerCompiler)
app.setValidatorCompiler(validatorCompiler)
app.register(fastifyCors)
app.register(createUserController)
app.listen({ port: PORT }).then(() => {
  console.log(`Server running on port ${PORT}`)
})
