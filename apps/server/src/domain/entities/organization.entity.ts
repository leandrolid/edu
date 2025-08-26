import type { Member } from '@prisma/client'

export class Organization {
  constructor(
    readonly id: string,
    readonly name: string,
    readonly avatarUrl: string | null,
    readonly createdAt: Date,
    readonly updatedAt: Date,
    readonly slug: string,
    readonly ownerId: string,
    readonly domain: string | null,
    readonly shouldAttachUserByDomain: boolean,
  ) {}

  readonly members!: Member[]
}
