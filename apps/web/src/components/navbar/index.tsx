import { auth } from '@/auth'
import { Navlink } from '@/components/navlink'
import { TabNav } from '@radix-ui/themes'

export const Navbar = async () => {
  const slug = await auth.getCurrentOrganization()
  return (
    <TabNav.Root>
      <Navlink href={`/${slug}/teams`}>Times</Navlink>
      <Navlink href={`/${slug}/settings`}>Configurações</Navlink>
    </TabNav.Root>
  )
}
