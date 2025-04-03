import { Button, Card, Flex, Text, TextField } from '@radix-ui/themes'
import Link from 'next/link'

export default function ForgotPasswordPage() {
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
      <form action="">
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

        <Button type="submit" size="2">
          Recuperar senha
        </Button>
        <Button variant="ghost" size="1" asChild>
          <Link href="/login">Fazer login</Link>
        </Button>
      </form>
    </Card>
  )
}
