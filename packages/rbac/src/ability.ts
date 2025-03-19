import { createMongoAbility, CreateAbility, MongoAbility, AbilityBuilder } from '@casl/ability'
import { permissions } from './permissions'
import { User } from './entities/user.entity'
import { UserSubject } from './subjects/user.subject'
import { OrganizationSubject } from './subjects/organization.subject'

type AppAbilities = UserSubject | OrganizationSubject | ['manage', 'all']

export type AppAbility = MongoAbility<AppAbilities>
const createAppAbility = createMongoAbility as CreateAbility<AppAbility>

export const defineAbilityFor = (user: User) => {
  if (typeof permissions[user.role] !== 'function') {
    throw new Error(`Invalid role: ${user.role}`)
  }
  const builder = new AbilityBuilder(createAppAbility)
  permissions[user.role](user, builder)

  const ability = builder.build({
    detectSubjectType(subject) {
      return subject.__typename
    },
  })
  ability.can = ability.can.bind(ability)
  ability.cannot = ability.cannot.bind(ability)
  return ability
}
