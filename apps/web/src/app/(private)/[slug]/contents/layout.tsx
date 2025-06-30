import { auth } from '@/auth'
import { AsideMenu } from '@/components/navigation/aside-menu'
import { LineVertical } from '@phosphor-icons/react/dist/ssr'
import { Box, Flex, Heading, Separator } from '@radix-ui/themes'

export default async function ContentsLayout({
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
          Conteúdos
        </Heading>
        <LineVertical weight="bold" style={{ rotate: '20deg' }} />
      </Flex>
      <Separator orientation="horizontal" size="4" />
      <Box p="4" style={{ maxWidth: '1440px', margin: '0 auto' }}>
        <Flex direction={{ initial: 'column', sm: 'row' }} gap="4">
          <AsideMenu.Root>
            <AsideMenu.Item href={`/${slug}/contents`}>Geral</AsideMenu.Item>
            <AsideMenu.Item href={`/${slug}/contents/videos`}>Vídeos</AsideMenu.Item>
          </AsideMenu.Root>

          <Flex direction="column" gap="6" flexGrow="1">
            {children}
          </Flex>
        </Flex>
      </Box>
    </Box>
  )
}
