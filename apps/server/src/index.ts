import { defineAbilityFor } from '@edu/rbac'

const { can } = defineAbilityFor({ id: '1', role: 'admin', organization: 'a' } as any)
console.log(can('update', { ownerId: '1', slug: 'a', __typename: 'Organization' })) // false
