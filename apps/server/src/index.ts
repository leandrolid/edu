import { defineAbilityFor } from '@edu/rbac'

const { can } = defineAbilityFor({ role: 'admin' as any })
console.log(can('read', 'User'))
