import type { StreamVideoInput } from '@app/materials/stream-video/stream-video.input'
import type { IValidation, IValidator } from '@edu/framework'
import { slugSchema } from '@infra/http/controllers/organizations/get-organization/get-organization.validation'
import z from 'zod'

export type StreamVideoHeaders = Pick<StreamVideoInput, 'range'>
export type StreamVideoParams = Pick<StreamVideoInput, 'videoId'> & {
  slug: string
}

export class StreamVideoValidation implements IValidation {
  headers?: IValidator<StreamVideoHeaders> = z
    .object({
      range: z
        .string({ message: 'É necessário informar o cabeçalho Range para streaming de vídeo' })
        .transform((value) => Number(value.replace(/\D/g, '')))
        .optional(),
      cookie: z
        .string({ message: 'Cookies inválidos' })
        .transform((value) => {
          if (!value) return ''
          const token = value.split(';').find((part) => part.includes('token='))
          if (!token) return ''
          return token.split('=')[1]
        })
        .optional(),
      authorization: z.string({ message: 'Cabeçalho de autenticação inválido' }).optional(),
    })
    .transform((data) => ({
      ...data,
      authorization: !data.authorization ? `Bearer ${data.cookie}` : data.authorization,
    }))

  params?: IValidator<StreamVideoParams> = z.object({
    videoId: z.string({ message: 'É necessário informar o ID do vídeo' }),
    slug: slugSchema,
  })
}
