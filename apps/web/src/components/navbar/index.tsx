import { Navlink } from '@/components/navlink'
import { TabNav } from '@radix-ui/themes'
import { getCookie } from 'cookies-next'
import { cookies } from 'next/headers'

export const Navbar = async () => {
  const slug = await getCookie('slug', { cookies })
  return (
    <TabNav.Root>
      <Navlink href={`/org/${slug}/members`}>Membros</Navlink>
      <Navlink href={`/org/${slug}/settings`}>Configurações</Navlink>
    </TabNav.Root>
  )
}
