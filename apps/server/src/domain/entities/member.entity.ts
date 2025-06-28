import type { Team } from '@domain/entities/team.entity'
import type { User } from '@domain/entities/user.entity'
import type { RbacRole } from '@edu/rbac'

export class Member {
  constructor(
    readonly id: string,
    readonly createdAt: Date,
    readonly updatedAt: Date,
    readonly userId: string,
    readonly roles: RbacRole[],
    readonly organizationId: string,
    readonly slug: string,
    readonly teamId: string,
  ) {}

  readonly team: Team = Object.create(null)
  readonly user: User = Object.create(null)
}
