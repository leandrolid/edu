import { Role } from '@prisma/client'

export interface IUser {
  id: string
  slug?: string
  organizationId?: string
  roles?: Role[]
}
