import { IUser } from '@domain/dtos/user.dto'
import { NotFoundError } from '@domain/errors/not-found.error'
import { UnauthorizedError } from '@domain/errors/unauthorized.error'
import { UnprocessableEntityError } from '@domain/errors/unprocessable-entity.error'
import { IPermissionService } from '@domain/services/permission.service'
import {
  AppAbility,
  defineAbilityFor,
  RbacOrganization,
  rbacOrganizationSchema,
  RbacUser,
  rbacUserSchema,
} from '@edu/rbac'
import { Injectable } from '@infra/_injection'
import { prisma } from '@infra/database/connections/prisma.connection'
import { get } from 'radash'

@Injectable({ token: 'IPermissionService' })
export class PermissionService implements IPermissionService {
  async defineAbilityFor(user: IUser): Promise<AppAbility> {
    if (!user.slug) {
      const rbacUser = await this.getRbacUser(user.id)
      return defineAbilityFor(rbacUser)
    }
    const merberships = await prisma.member.findMany({
      where: { userId: user.id, organization: { slug: user.slug } },
    })
    if (merberships.length === 0) {
      throw new UnauthorizedError('Usuário não autorizado')
    }
    return defineAbilityFor(
      this.parseUser({
        id: user.id,
        roles: merberships.map((m) => m.role),
        slug: user.slug,
      }),
    )
  }

  async getRbacUser(userId: string): Promise<RbacUser> {
    const user = await prisma.user.findUnique({ where: { id: userId } })
    if (!user) {
      throw new NotFoundError('Usuário não encontrado')
    }
    return this.parseUser({ id: user.id, roles: [user.role], slug: '' })
  }

  async getRbacOrg(slug: string): Promise<RbacOrganization> {
    const organization = await prisma.organization.findUnique({ where: { slug } })
    if (!organization) {
      throw new NotFoundError('Organização não encontrada')
    }
    return this.parseOrganization(organization)
  }

  private parseUser(user: { id: string; roles: string[]; slug: string }) {
    try {
      return rbacUserSchema.parse(user)
    } catch (error) {
      throw new UnprocessableEntityError('Usuário inválido')
    }
  }

  private parseOrganization(organization: { id: string; slug: string; ownerId: string }) {
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
