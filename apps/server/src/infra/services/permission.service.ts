import { IOrganization } from '@domain/dtos/organization.dto'
import { IUser } from '@domain/dtos/user.dto'
import { UnauthorizedError } from '@domain/errors/unauthorized.error'
import { UnprocessableEntityError } from '@domain/errors/unprocessable-entity.error'
import { IPermissionService } from '@domain/services/permission.service'
import {
  AppAbility,
  defineAbilityFor,
  RbacOrganization,
  rbacOrganizationSchema,
  rbacUserSchema,
} from '@edu/rbac'
import { Injectable } from '@infra/_injection'
import { prisma } from '@infra/database/connections/prisma.connection'
import { get } from 'radash'

@Injectable({ token: 'IPermissionService' })
export class PermissionService implements IPermissionService {
  async defineAbilityFor(user: IUser): Promise<AppAbility> {
    if (!user.slug) {
      return this.getAbilityOutOrganization(user.id)
    }
    return this.getAbilityInOrganization(user.id, user.slug)
  }

  private async getAbilityOutOrganization(userId: string): Promise<AppAbility> {
    const user = await prisma.user.findUnique({ where: { id: userId } })
    if (!user) {
      throw new UnauthorizedError('Usuário não autorizado')
    }
    const rbacUser = this.parseUser({
      id: user.id,
      roles: [user.role],
      slug: '',
    })
    return defineAbilityFor(rbacUser)
  }

  private async getAbilityInOrganization(userId: string, slug: string): Promise<AppAbility> {
    const merberships = await prisma.member.findMany({
      where: { userId: userId, organization: { slug } },
    })
    if (merberships.length === 0) {
      throw new UnauthorizedError('Usuário não autorizado')
    }
    const rbacUser = this.parseUser({
      id: userId,
      roles: merberships.map((m) => m.role),
      slug,
    })
    return defineAbilityFor(rbacUser)
  }

  private parseUser(user: { id: string; roles: string[]; slug: string }) {
    try {
      return rbacUserSchema.parse(user)
    } catch (error) {
      throw new UnprocessableEntityError('Usuário inválido')
    }
  }

  public getRbacOrganization(organization: IOrganization): RbacOrganization {
    try {
      return rbacOrganizationSchema.parse(organization)
    } catch (error) {
      throw new UnprocessableEntityError('Organização inválida')
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
