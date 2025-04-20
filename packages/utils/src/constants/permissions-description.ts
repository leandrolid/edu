import { RbacRole } from '@edu/rbac'

export const PERMISSIONS_DESCRIPTION: Array<{
  name: string
  description: string
  value: RbacRole
}> = [
  {
    value: 'OWNER',
    name: 'Dono',
    description: 'Acesso total aos dados e funcionalidades do sistema',
  },
  {
    value: 'ORGANIZATION_ADMIN',
    name: 'Administrador de Organização',
    description: 'Permissão total à organização',
  },
  {
    value: 'ORGANIZATION_CONTRIBUTOR',
    name: 'Colaborador de Organização',
    description: 'Permite ver e atualizar detalhes da organização',
  },
  {
    value: 'ORGANIZATION_MEMBER',
    name: 'Membro de Organização',
    description: 'Permite ver detalhes da organização',
  },
  {
    value: 'ORGANIZATION_BILLING',
    name: 'Faturamento de Organização',
    description: 'Permite ver o faturamento da organização',
  },
  {
    value: 'TEAM_ADMIN',
    name: 'Administrador de Time',
    description: 'Permissão total aos times',
  },
  {
    value: 'TEAM_CONTRIBUTOR',
    name: 'Colaborador de Time',
    description: 'Permite ver e atualizar detalhes dos times',
  },
  {
    value: 'TEAM_MEMBER',
    name: 'Membro de Time',
    description: 'Permite ver detalhes dos times',
  },
  {
    value: 'MEMBER_ADMIN',
    name: 'Administrador de Usuário',
    description: 'Permissão total aos usuários',
  },
  {
    value: 'MEMBER_CONTRIBUTOR',
    name: 'Colaborador de Usuário',
    description: 'Permite ver e atualizar detalhes dos usuários',
  },
  {
    value: 'MEMBER',
    name: 'Usuário',
    description: 'Permite ver detalhes dos usuários',
  },
]
