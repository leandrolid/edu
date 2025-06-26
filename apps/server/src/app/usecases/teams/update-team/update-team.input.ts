import type { Role } from '@prisma/client'

export type UpdateTeamInput = {
  teamId: string
  name: string
  description?: string
  roles: Role[]
  updateAllMembers?: boolean
}
