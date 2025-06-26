import type { StreamVideoInput } from '@app/usecases/materials/stream-video/stream-video.input'
import type { IValidation, IValidator } from '@edu/framework'
import { slugSchema } from '@infra/http/controllers/organizations/get-organization/get-organization.validation'
import z from 'zod'

export type StreamVideoHeaders = Pick<StreamVideoInput, 'range'>
export type StreamVideoParams = Pick<StreamVideoInput, 'videoId' | 'fileName'> & {
  slug: string
}

export class StreamVideoValidation implements IValidation {
  headers?: IValidator<StreamVideoHeaders> = z.object({
    range: z
      .string({ message: 'É necessário informar o cabeçalho Range para streaming de vídeo' })
      .optional(),
    authorization: z.string({ message: 'Cabeçalho de autenticação inválido' }).optional(),
  })

  params?: IValidator<StreamVideoParams> = z.object({
    videoId: z.string({ message: 'É necessário informar o ID do vídeo' }),
    fileName: z.string({ message: 'É necessário informar a resolução do vídeo' }),
    slug: slugSchema,
  })
}
