import { IUser } from '@domain/dtos/user.dto'
import { UnauthorizedError } from '@domain/errors/unauthorized.error'
import { UnprocessableEntityError } from '@domain/errors/unprocessable-entity.error'
import { defineAbilityFor, rbacOrganizationSchema, rbacUserSchema } from '@edu/rbac'
import { Injectable } from '@infra/_injection'
import { prisma } from '@infra/database/connections/prisma.connection'
import { get } from 'radash'

@Injectable({ token: 'IPermissionService' })
export class PermissionService {
  async defineAbilityFor(input: {
    user: IUser
    slug?: string
  }): Promise<ReturnType<typeof defineAbilityFor>> {
    if (!input.slug) {
      const user = await prisma.user.findUnique({ where: { id: input.user.id } })
      if (!user) {
        throw new UnauthorizedError('Usuário não autorizado')
      }
      return defineAbilityFor(this.parseUser({ id: user.id, roles: [user.role], slug: '' }))
    }
    const merberships = await prisma.member.findMany({
      where: { userId: input.user.id, organization: { slug: input.slug } },
    })
    if (merberships.length === 0) {
      throw new UnauthorizedError('Usuário não autorizado')
    }
    return defineAbilityFor(
      this.parseUser({
        id: input.user.id,
        roles: merberships.map((m) => m.role),
        slug: input.slug,
      }),
    )
  }

  public parseUser(user: { id: string; roles: string[]; slug: string }) {
    try {
      return rbacUserSchema.parse(user)
    } catch (error) {
      throw new UnprocessableEntityError('Usuário inválido')
    }
  }

  public parseOrganization(organization: { id: string; slug: string }) {
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
