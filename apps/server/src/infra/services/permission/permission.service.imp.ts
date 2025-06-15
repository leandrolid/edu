import type { IUser } from '@domain/dtos/user.dto'
import { BadRequestError, Injectable } from '@edu/framework'
import {
  type AppAbility,
  defineAbilityFor,
  type RbacMember,
  rbacMemberSchema,
  type RbacOrganization,
  rbacOrganizationSchema,
  type RbacRole,
  type RbacTeam,
  rbacTeamSchema,
  rbacUserSchema,
} from '@edu/rbac'
import type { IPermissionService } from '@infra/services/permission/permission.service'
import { get } from 'radash'

@Injectable({ token: 'IPermissionService' })
export class PermissionService implements IPermissionService {
  defineAbilityFor(user: IUser): AppAbility {
    const rbacUser = this.parseUser({
      id: user.id,
      owner: user.owner,
      roles: this.getUserRoles(user),
      slug: user.slug || '',
      organizationId: user.organizationId || '',
    })
    return defineAbilityFor(rbacUser)
  }

  private getUserRoles(user: IUser): RbacRole[] {
    if (user.owner) return ['OWNER']
    if (Array.isArray(user.roles) && user.roles.length > 0) return user.roles
    return ['DEFAULT']
  }

  private parseUser(user: IUser) {
    try {
      return rbacUserSchema.parse(user)
    } catch (error) {
      throw new BadRequestError('Usuário inválido')
    }
  }

  public getOrganization(user: IUser): RbacOrganization {
    try {
      return rbacOrganizationSchema.parse({ id: user.organizationId, slug: user.slug })
    } catch (error) {
      throw new BadRequestError('Organização inválida')
    }
  }

  public getMember(user: IUser): RbacMember {
    try {
      return rbacMemberSchema.parse({ userId: user.id, organizationId: user.organizationId })
    } catch (error) {
      throw new BadRequestError('Membro inválido')
    }
  }

  public getTeam(user: IUser): RbacTeam {
    try {
      return rbacTeamSchema.parse({ organizationId: user.organizationId })
    } catch (error) {
      throw new BadRequestError('Time inválido')
    }
  }

  private interpolate(template: string, vars: object) {
    return JSON.parse(template, (_, rawValue) => {
      if (rawValue[0] !== '$') {
        return rawValue
      }
      const name = rawValue.slice(2, -1)
      const value = get(vars, name)
      if (typeof value === 'undefined') {
        throw new ReferenceError(`Variable ${name} is not defined`)
      }
      return value
    })
  }
}
