'use client'

import { TabNav } from '@radix-ui/themes'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

type Props = {
  href: string
  children: React.ReactNode
} & TabNav.LinkProps

export const Navlink = ({ href, children, ...props }: Props) => {
  const pathname = usePathname()
  const isActive = pathname.includes(href)
  return (
    <TabNav.Link {...props} asChild active={isActive}>
      <Link href={href}>{children}</Link>
    </TabNav.Link>
  )
}
