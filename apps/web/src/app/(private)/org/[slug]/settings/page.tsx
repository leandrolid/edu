import { LineVertical } from '@phosphor-icons/react/dist/ssr'
import {
  Box,
  Button,
  Card,
  Checkbox,
  Container,
  Flex,
  Heading,
  Separator,
  Text,
  TextField,
} from '@radix-ui/themes'
import { getCookie } from 'cookies-next'
import { cookies } from 'next/headers'
import Link from 'next/link'

export default async function SettingsPage() {
  const slug = await getCookie('slug', { cookies })
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
                style={{ margin: 0, textAlign: 'left', justifyContent: 'start' }}
              >
                <Link href={`/org/${slug}/settings`}>Geral</Link>
              </Button>
              <Button
                asChild
                variant="ghost"
                style={{ margin: 0, textAlign: 'left', justifyContent: 'start' }}
              >
                <Link href={`/org/${slug}/settings`}>Financeiro</Link>
              </Button>
              <Button
                asChild
                variant="ghost"
                style={{ margin: 0, textAlign: 'left', justifyContent: 'start' }}
              >
                <Link href={`/org/${slug}/settings`}>Filiais</Link>
              </Button>
            </nav>
          </Flex>

          <Flex direction="column" gap="4" flexGrow="1">
            <Card variant="surface" style={{ width: '100%', padding: 0 }}>
              <form>
                <Flex direction="column" gap="4" p="6">
                  <Heading as="h6" size="4" mb="4">
                    Configurações da organização
                  </Heading>

                  <Flex direction="column" gap="2">
                    <Text as="label" size="2" htmlFor="organizationName">
                      Nome da organização
                    </Text>
                    <TextField.Root
                      id="organizationName"
                      name="organizationName"
                      placeholder="Minha organização"
                      size="2"
                    />
                  </Flex>

                  <Flex direction="column" gap="2">
                    <Text as="label" size="2" htmlFor="organizationDomain">
                      Domínio da organização
                    </Text>
                    <TextField.Root
                      id="organizationDomain"
                      name="organizationDomain"
                      placeholder="exemplo.com"
                      size="2"
                    />
                  </Flex>

                  <Flex direction="column" gap="2">
                    <Text as="label" size="2" htmlFor="organizationAutoJoin">
                      <Checkbox id="organizationAutoJoin" name="organizationAutoJoin" mr="1" />
                      Auto adicionar novos membros pelo Domínio
                    </Text>
                  </Flex>
                </Flex>

                <Separator orientation="horizontal" size="4" />

                <Flex p="5">
                  <Button variant="solid" size="2" ml="auto">
                    Salvar
                  </Button>
                </Flex>
              </form>
            </Card>
          </Flex>
        </Flex>
      </Container>
    </Box>
  )
}
