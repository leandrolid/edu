import { prisma } from '@infra/database/connections/prisma.connection'
import { hash } from 'bcrypt'
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
      const { name, email, password } = request.body
      const userExists = await prisma.user.findUnique({ where: { email } })
      if (userExists) {
        return reply.status(400).send({ message: 'User already exists' })
      }
      await prisma.user.create({
        data: { name, email, passwordHash: await hash(password, 10) },
      })
      return reply.status(201).send({ message: 'User created' })
    },
  )
}
