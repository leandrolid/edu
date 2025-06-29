import { Button, Flex } from '@radix-ui/themes'
import Link, { LinkProps } from 'next/link'

function Root({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <Flex asChild direction="column" gap="2" width="200px" py="6" flexShrink="0">
      <nav>{children}</nav>
    </Flex>
  )
}

function Item({
  children,
  ...props
}: Readonly<{
  children: React.ReactNode
}> &
  LinkProps) {
  return (
    <Button
      asChild
      variant="ghost"
      style={{
        boxSizing: 'border-box',
        textAlign: 'left',
        justifyContent: 'start',
      }}
    >
      <Link {...props}>{children}</Link>
    </Button>
  )
}

export const AsideMenu = {
  Root,
  Item,
}
