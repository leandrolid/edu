import type { CreateVideoInput } from '@app/usecases/videos/create-video/create-video.input'
import type { IValidation, IValidator } from '@edu/framework'
import { slugSchema } from '@infra/http/controllers/organizations/get-organization/get-organization.validation'
import z from 'zod'

export type CreateVideoParams = {
  slug: string
}
export type CreateVideoForm = Omit<CreateVideoInput, 'slug'>

export class CreateVideoValidation implements IValidation {
  params: IValidator<CreateVideoParams> = z.object({
    slug: slugSchema,
  })
}
