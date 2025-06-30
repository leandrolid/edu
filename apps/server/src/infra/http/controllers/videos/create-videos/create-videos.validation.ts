import type { CreateVideosInput } from '@app/usecases/videos/create-videos/create-videos.input'
import { FormFile, type IValidation, type IValidator } from '@edu/framework'
import z from 'zod'

export class CreateVideosValidation implements IValidation {
  body?: IValidator<CreateVideosInput> = z.object({
    videos: z.array(
      z.object({
        title: z
          .string({ message: 'Título inválido' })
          .min(1, { message: 'O título é obrigatório' }),
        description: z
          .string({ message: 'Descrição inválida' })
          .min(1, { message: 'A descrição é obrigatória' }),
        duration: z.coerce
          .number({ message: 'Duração inválida' })
          .min(0, { message: 'A duração não pode ser negativa' })
          .optional()
          .default(0),
        file: z.instanceof(FormFile),
        tags: z
          .array(z.string({ message: 'Tag inválida' }))
          .min(1, { message: 'Pelo menos uma tag é obrigatória' }),
      }),
    ),
  })
}
