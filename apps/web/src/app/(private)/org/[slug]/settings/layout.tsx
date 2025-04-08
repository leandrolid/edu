import { auth } from '@/auth'
import { LineVertical } from '@phosphor-icons/react/dist/ssr'
import { Box, Button, Container, Flex, Heading, Separator } from '@radix-ui/themes'
import Link from 'next/link'

export default async function SettingsLayout({
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
          Configurações
        </Heading>
        <LineVertical weight="bold" style={{ rotate: '20deg' }} />
      </Flex>
      <Separator orientation="horizontal" size="4" />
      <Container size="4" p="4">
        <Flex gap="4">
          <Flex direction="column" align="start" gap="2" width="250px" flexShrink="0" asChild>
            <nav>
              <Button
                asChild
                variant="ghost"
                style={{
                  width: '250px',
                  boxSizing: 'border-box',
                  textAlign: 'left',
                  justifyContent: 'start',
                }}
              >
                <Link href={`/org/${slug}/settings`}>Geral</Link>
              </Button>
              <Button
                asChild
                variant="ghost"
                style={{
                  width: '250px',
                  boxSizing: 'border-box',
                  textAlign: 'left',
                  justifyContent: 'start',
                }}
              >
                <Link href={`/org/${slug}/settings/billing`}>Financeiro</Link>
              </Button>
              <Button
                asChild
                variant="ghost"
                style={{
                  width: '250px',
                  boxSizing: 'border-box',
                  textAlign: 'left',
                  justifyContent: 'start',
                }}
              >
                <Link href={`/org/${slug}/settings/subsidiaries`}>Filiais</Link>
              </Button>
            </nav>
          </Flex>

          <Flex direction="column" gap="4" flexGrow="1">
            {children}
          </Flex>
        </Flex>
      </Container>
    </Box>
  )
}
