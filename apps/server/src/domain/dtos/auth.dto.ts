import { IUser } from '@domain/dtos/user.dto'
import type { Prettify } from '@edu/utils'

export type Auth<T = unknown> = Prettify<
  {
    user: IUser
  } & T
>
