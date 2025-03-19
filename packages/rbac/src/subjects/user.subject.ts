import { User } from '../entities/user.entity'

export type UserSubject = [
  'manage' | 'create' | 'read' | 'update' | 'change-password' | 'delete',
  'User' | User,
]
