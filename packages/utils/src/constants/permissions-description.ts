import { RbacRole } from '@edu/rbac'

export const PERMISSIONS_DESCRIPTION: Array<{
  name: string
  description: string
  value: RbacRole
}> = [
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
    name: 'Administrador de Integrante',
    description: 'Permissão total aos integrantes',
  },
  {
    value: 'MEMBER_CONTRIBUTOR',
    name: 'Colaborador de Integrante',
    description: 'Permite ver e atualizar detalhes dos integrantes',
  },
  {
    value: 'MEMBER',
    name: 'Membro de Integrante',
    description: 'Permite ver detalhes dos integrantes',
  },
]
