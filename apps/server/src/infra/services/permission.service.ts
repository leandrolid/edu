import { IUser } from '@domain/dtos/user.dto'
import { UnprocessableEntityError } from '@domain/errors/unprocessable-entity.error'
import { IPermissionService } from '@domain/services/permission.service'
import {
  AppAbility,
  defineAbilityFor,
  rbacMemberSchema,
  RbacOrganization,
  rbacOrganizationSchema,
  RbacUser,
  rbacUserSchema,
} from '@edu/rbac'
import { RbacMember } from '@edu/rbac/src/entities/member.entity'
import { Injectable } from '@infra/_injection'
import { get } from 'radash'

@Injectable({ token: 'IPermissionService' })
export class PermissionService implements IPermissionService {
  async defineAbilityFor(user: IUser): Promise<AppAbility> {
    if (!user.slug) {
      return this.getAbilityOutOrganization(user.id)
    }
    return this.getAbilityInOrganization(user)
  }

  private async getAbilityOutOrganization(userId: string): Promise<AppAbility> {
    const rbacUser = this.parseUser({
      id: userId,
      roles: ['USER'],
      slug: '',
      organizationId: '',
    })
    return defineAbilityFor(rbacUser)
  }

  private async getAbilityInOrganization(user: IUser): Promise<AppAbility> {
    const rbacUser = this.parseUser({
      id: user.id,
      roles: user.roles!,
      slug: user.slug!,
      organizationId: user.organizationId!,
    })
    return defineAbilityFor(rbacUser)
  }

  private parseUser(user: Omit<RbacUser, '__typename'>) {
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
