import { RbacMember } from '../entities/member.entity'

export type MemberSubject = [
  'manage' | 'create' | 'read' | 'update' | 'delete',
  'Member' | RbacMember,
]
