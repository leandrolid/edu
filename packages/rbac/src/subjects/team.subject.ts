import type { RbacTeam } from '../entities/team.entity'

export type TeamSubject = ['manage' | 'create' | 'read' | 'update' | 'delete', 'Team' | RbacTeam]
