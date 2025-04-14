import { AbilityBuilder, CreateAbility, createMongoAbility, MongoAbility } from '@casl/ability'
import { RbacUser } from './entities/user.entity'
import { permissions } from './permissions'
import { MemberSubject } from './subjects/member.subject'
import { OrganizationSubject } from './subjects/organization.subject'
import { UserSubject } from './subjects/user.subject'

type AppAbilities = UserSubject | OrganizationSubject | MemberSubject | ['manage', 'all']

export type AppAbility = MongoAbility<AppAbilities>
const createAppAbility = createMongoAbility as CreateAbility<AppAbility>

export const defineAbilityFor = (user: RbacUser) => {
  if (!Array.isArray(user.roles) || user.roles.length === 0) {
    throw new Error(`Invalid roles: ${user.roles}`)
  }
  const builder = new AbilityBuilder(createAppAbility)
  user.roles.forEach((role) => {
    permissions[role](user, builder)
  })
  const ability = builder.build({
    detectSubjectType(subject) {
      return subject.__typename
    },
  })
  ability.can = ability.can.bind(ability)
  ability.cannot = ability.cannot.bind(ability)
  return ability
}
