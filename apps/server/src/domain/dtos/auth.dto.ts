import { IUser } from '@domain/dtos/user.dto'

export type Auth<T = unknown> = {
  user: IUser
} & T
