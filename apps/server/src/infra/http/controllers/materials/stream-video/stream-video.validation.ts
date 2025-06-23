import type { StreamVideoInput } from '@app/materials/stream-video/stream-video.input'
import type { IValidation, IValidator } from '@edu/framework'
import { slugSchema } from '@infra/http/controllers/organizations/get-organization/get-organization.validation'
import z from 'zod'

export type StreamVideoHeaders = Pick<StreamVideoInput, 'range' | 'networkSpeedMbps'>
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
      authorization: z.string({ message: 'Cabeçalho de autenticação inválido' }).optional(),
      'x-network-speed-mbps': z.coerce
        .number({
          message: 'É necessário informar a velocidade da rede em Mbps',
        })
        .optional()
        .default(0),
    })
    .transform((data) => ({
      ...data,
      networkSpeedMbps: data['x-network-speed-mbps'],
    }))

  params?: IValidator<StreamVideoParams> = z.object({
    videoId: z.string({ message: 'É necessário informar o ID do vídeo' }),
    slug: slugSchema,
  })
}
