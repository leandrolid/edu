import { Button, Flex, Heading, Text } from '@radix-ui/themes'
import Link from 'next/link'

export default function NotFound() {
  return (
    <Flex align="center" justify="center" height="100vh">
      <Flex
        direction="column"
        align="center"
        justify="center"
        gap="2"
        width="100%"
        maxWidth="500px"
        p="4"
      >
        <Heading as="h2">Não encontrado</Heading>
        <Text size="3" color="gray" align="center">
          A página que você está tentando acessar não existe ou foi removida. Verifique o URL e
          tente novamente.
        </Text>
        <Button variant="ghost" asChild>
          <Link href="/">Voltar para a página inicial</Link>
        </Button>
      </Flex>
    </Flex>
  )
}
