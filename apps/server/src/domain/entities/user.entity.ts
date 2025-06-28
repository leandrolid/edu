export class User {
  constructor(
    readonly id: string,
    readonly name: string | null,
    readonly email: string | null,
    readonly passwordHash: string | null,
    readonly avatarUrl: string | null,
    readonly createdAt: Date,
    readonly updatedAt: Date,
    readonly owner: boolean,
  ) {}
}
