import { RbacRole } from '@edu/rbac'

export const PERMISSIONS_DESCRIPTION: Array<{
  name: string
  description: string
  value: RbacRole
}> = [
  {
    value: 'ORGANIZATION_ADMIN',
    name: 'Gerenciar Organização',
    description: 'Permissão total à organização',
  },
  {
    value: 'ORGANIZATION_CONTRIBUTOR',
    name: 'Atualizar Organização',
    description: 'Permite ver e atualizar detalhes da organização',
  },
  {
    value: 'ORGANIZATION_MEMBER',
    name: 'Visualizar Organização',
    description: 'Permite ver detalhes da organização',
  },
  {
    value: 'ORGANIZATION_BILLING',
    name: 'Visualizar Faturamento',
    description: 'Permite ver o faturamento da organização',
  },
  {
    value: 'TEAM_ADMIN',
    name: 'Gerenciar Time',
    description: 'Permissão total aos times',
  },
  {
    value: 'TEAM_CONTRIBUTOR',
    name: 'Atualizar Time',
    description: 'Permite ver e atualizar detalhes dos times',
  },
  {
    value: 'TEAM_MEMBER',
    name: 'Visualizar Time',
    description: 'Permite ver detalhes dos times',
  },
  {
    value: 'MEMBER_ADMIN',
    name: 'Gerenciar Integrante',
    description: 'Permissão total aos integrantes',
  },
  {
    value: 'MEMBER_CONTRIBUTOR',
    name: 'Atualizar Integrante',
    description: 'Permite ver e atualizar detalhes dos integrantes',
  },
  {
    value: 'MEMBER',
    name: 'Visualizar Integrante',
    description: 'Permite ver detalhes dos integrantes',
  },
]
