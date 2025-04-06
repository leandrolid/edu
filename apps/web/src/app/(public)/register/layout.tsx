import { auth } from '@/auth'
import { Flex } from '@radix-ui/themes'
import { redirect } from 'next/navigation'

export default async function RegisterLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const isAuthenticated = await auth.isAuthenticated()
  if (isAuthenticated) {
    return redirect('/org')
  }
  return (
    <Flex direction="column" align="center" justify="center" gap="2" p="4" height="100vh">
      {children}
    </Flex>
  )
}
