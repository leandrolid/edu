'use client'

import { loginWithEmailAndPassword } from '@/app/(public)/login/actions'
import { Warning } from '@phosphor-icons/react/dist/ssr'
import { Flex, TextField, Button, Text, Card, Callout } from '@radix-ui/themes'
import Link from 'next/link'
import { useActionState } from 'react'

export function LoginForm() {
  const [state, formAction, isPending] = useActionState(loginWithEmailAndPassword, {
    success: false,
    message: null,
    errors: null,
  })
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
      <form action={formAction}>
        {state.message && (
          <Callout.Root color="red" variant="soft">
            <Callout.Icon>
              <Warning weight="bold" />
            </Callout.Icon>
            <Callout.Text>{state.message}</Callout.Text>
          </Callout.Root>
        )}
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
          <Text size="1" color="red">
            {state.errors?.email && state.errors.email[0]}
          </Text>
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
          <Text size="1" color="red">
            {state.errors?.password && state.errors.password[0]}
          </Text>
          <Text size="1" color="indigo" asChild>
            <Link href="/forgot-password">Esqueci minha senha</Link>
          </Text>
        </Flex>

        <Button type="submit" size="2" loading={isPending} disabled={isPending}>
          Entrar
        </Button>
        <Button variant="ghost" size="1" asChild>
          <Link href="/register">Criar conta</Link>
        </Button>
      </form>
    </Card>
  )
}
