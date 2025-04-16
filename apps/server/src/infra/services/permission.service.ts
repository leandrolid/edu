import { IUser } from '@domain/dtos/user.dto'
import { UnprocessableEntityError } from '@domain/errors/unprocessable-entity.error'
import { IPermissionService } from '@domain/services/permission.service'
import {
  AppAbility,
  defineAbilityFor,
  rbacMemberSchema,
  RbacOrganization,
  rbacOrganizationSchema,
  rbacUserSchema,
} from '@edu/rbac'
import { RbacMember } from '@edu/rbac/src/entities/member.entity'
import { Injectable } from '@infra/_injection'
import { get } from 'radash'

@Injectable({ token: 'IPermissionService' })
export class PermissionService implements IPermissionService {
  async defineAbilityFor(user: IUser): Promise<AppAbility> {
    let inputUser: Required<IUser>
    if (!user.slug) {
      inputUser = { id: user.id, roles: ['USER'], slug: '', organizationId: '' }
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
      throw new UnprocessableEntityError('Usuário inválido')
    }
  }

  public getOrganization(user: IUser): RbacOrganization {
    try {
      return rbacOrganizationSchema.parse({ id: user.organizationId, slug: user.slug })
    } catch (error) {
      throw new UnprocessableEntityError('Organização inválida')
    }
  }

  public getMember(user: IUser): RbacMember {
    try {
      return rbacMemberSchema.parse({ userId: user.id, organizationId: user.organizationId })
    } catch (error) {
      throw new UnprocessableEntityError('Membro inválido')
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
