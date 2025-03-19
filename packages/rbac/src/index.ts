import {
  createMongoAbility,
  ForcedSubject,
  CreateAbility,
  MongoAbility,
  AbilityBuilder,
} from '@casl/ability'
import { permissions } from './permissions'
import { User } from './entities/user.entity'

const actions = ['manage', 'create', 'read'] as const
const subjects = ['User', 'all'] as const
type AppAbilities = [
  (typeof actions)[number],
  (
    | (typeof subjects)[number]
    | ForcedSubject<Exclude<(typeof subjects)[number], 'all'>>
  ),
]

export type AppAbility = MongoAbility<AppAbilities>
const createAppAbility = createMongoAbility as CreateAbility<AppAbility>

export const defineAbilityFor = (user: User) => {
  if (typeof permissions[user.role] !== 'function') {
    throw new Error(`Invalid role: ${user.role}`)
  }
  const builder = new AbilityBuilder(createAppAbility)
  permissions[user.role](user, builder)

  const ability = builder.build()
  ability.can = ability.can.bind(ability)
  ability.cannot = ability.cannot.bind(ability)
  return ability
}
