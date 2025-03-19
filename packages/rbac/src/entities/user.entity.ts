import { Role } from '../types/role.type'

export type User = {
  __typename: 'User'
  id: string
  role: Role
  organization: string
}
