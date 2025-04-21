import type { IUser } from '@domain/dtos/user.dto'
import { BadRequestError } from '@domain/errors/bad-request.error'
import {
  type AppAbility,
  defineAbilityFor,
  type RbacMember,
  rbacMemberSchema,
  type RbacOrganization,
  rbacOrganizationSchema,
  type RbacTeam,
  rbacTeamSchema,
  rbacUserSchema,
} from '@edu/rbac'
import { Injectable } from '@infra/_injection'
import type { IPermissionService } from '@infra/services/permission/permission.service'
import { get } from 'radash'

@Injectable({ token: 'IPermissionService' })
export class PermissionService implements IPermissionService {
  defineAbilityFor(user: IUser): AppAbility {
    let inputUser: Required<IUser>
    if (!user.slug) {
      inputUser = { id: user.id, roles: ['DEFAULT'], slug: '', organizationId: '' }
    } else {
      inputUser = user as Required<IUser>
    }
    const rbacUser = this.parseUser(inputUser)
    return defineAbilityFor(rbacUser)
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
