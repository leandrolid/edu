import type { FastifyInstance } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'
import z from 'zod'

export const createUserController = async (app: FastifyInstance) => {
  app.withTypeProvider<ZodTypeProvider>().post(
    '/users',
    {
      schema: {
        body: z.object({
          name: z.string(),
          email: z.string().email(),
          password: z
            .string()
            .min(8)
            .refine((password) => {
              return /[a-z]/.test(password) && /[A-Z]/.test(password) && /[0-9]/.test(password)
            }, 'Password must contain at least one lowercase letter, one uppercase letter, and one number'),
        }),
      },
    },
    async (request, reply) => {
      const { email, password } = request.body
      // create account logic
      return { email }
    },
  )
}
