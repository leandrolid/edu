import type { RbacRole } from '@edu/rbac'

export class Team {
  constructor(
    readonly id: string,
    readonly name: string,
    readonly roles: RbacRole[],
    readonly organizationId: string,
    readonly slug: string,
    readonly description: string,
    readonly ownerId: string,
  ) {}
}
