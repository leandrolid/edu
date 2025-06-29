import { auth } from '@/auth'
import { AsideMenu } from '@/components/navigation/aside-menu'
import { LineVertical } from '@phosphor-icons/react/dist/ssr'
import { Box, Container, Flex, Heading, Separator } from '@radix-ui/themes'

export default async function MembersLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const slug = await auth.getCurrentOrganization()
  return (
    <Box>
      <Flex
        align="center"
        gap="1"
        p="2"
        style={{
          background: 'var(--indigo-9)',
          color: 'var(--gray-1)',
        }}
      >
        <Heading as="h1" size="3">
          Times
        </Heading>
        <LineVertical weight="bold" style={{ rotate: '20deg' }} />
      </Flex>
      <Separator orientation="horizontal" size="4" />
      <Container size="4" p="4">
        <Flex gap="4">
          <AsideMenu.Root>
            <AsideMenu.Item href={`/${slug}/teams`}>Geral</AsideMenu.Item>
            <AsideMenu.Item href={`/${slug}/teams/users`}>Usuários</AsideMenu.Item>
          </AsideMenu.Root>

          <Flex direction="column" gap="4" flexGrow="1">
            {children}
          </Flex>
        </Flex>
      </Container>
    </Box>
  )
}
