import type { GetVideosInput } from '@app/usecases/videos/get-videos/get-videos.input'
import type { IValidation, IValidator } from '@edu/framework'
import z from 'zod'

export class GetVideosValidation implements IValidation {
  query?: IValidator<GetVideosInput> = z.object({
    search: z.string({ message: 'Pesquisa inválida' }).optional(),
    page: z.coerce
      .number({ message: 'Número da página inválido' })
      .int({ message: 'Número da página deve ser um inteiro' })
      .min(1, { message: 'Número da página deve ser maior ou igual a 1' })
      .default(1),
    pageSize: z.coerce
      .number({ message: 'Tamanho da página inválido' })
      .int({ message: 'Tamanho da página deve ser um inteiro' })
      .min(1, { message: 'Tamanho da página deve ser maior ou igual a 1' })
      .max(100, { message: 'Tamanho da página deve ser menor ou igual a 100' })
      .default(10),
  })
}
