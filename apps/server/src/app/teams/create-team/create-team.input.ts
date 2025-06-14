import type { Role } from '@prisma/client'

export type CreateTeamInput = {
  name: string
  description?: string
  roles: Role[]
}
