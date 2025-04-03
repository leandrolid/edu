import { loginWithEmailAndPassword } from '@/app/(public)/login/actions'
import { Button, Card, Flex, Text, TextField } from '@radix-ui/themes'
import Link from 'next/link'

export default function LoginPage() {
  return (
    <Card
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '1.5rem',
        padding: '1rem',
        width: '100%',
        maxWidth: '20rem',
      }}
      asChild
    >
      <form action={loginWithEmailAndPassword}>
        <Flex direction="column" gap="1">
          <Text as="label" htmlFor="email" size="2" weight="bold">
            E-mail
          </Text>
          <TextField.Root
            id="email"
            name="email"
            type="text"
            placeholder="email@exemplo.com"
            size="2"
            inputMode="email"
          />
        </Flex>
        <Flex direction="column" gap="1">
          <Text as="label" htmlFor="password" size="2" weight="bold">
            Senha
          </Text>
          <TextField.Root
            id="password"
            name="password"
            type="password"
            placeholder="********"
            size="2"
          />
          <Text size="1" color="indigo" asChild>
            <Link href="/forgot-password">Esqueci minha senha</Link>
          </Text>
        </Flex>

        <Button type="submit" size="2">
          Entrar
        </Button>
        <Button variant="ghost" size="1" asChild>
          <Link href="/register">Criar conta</Link>
        </Button>
      </form>
    </Card>
  )
}
