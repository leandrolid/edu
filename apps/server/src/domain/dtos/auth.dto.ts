import { IUser } from '@domain/dtos/user.dto'

export type Auth<T> = {
  user: IUser
} & T
