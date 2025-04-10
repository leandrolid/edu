'use client'

import { signOut } from '@/components/sign-out-button/actions'
import { SignOut } from '@phosphor-icons/react/dist/ssr'
import { Button, Flex } from '@radix-ui/themes'

export const SignOutButton = () => {
  return (
    <Flex align="center" gap="1">
      <Button
        variant="ghost"
        size="3"
        autoFocus={false}
        onClick={() => signOut()}
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flex: 1,
          margin: 0,
        }}
      >
        Sair <SignOut weight="regular" />
      </Button>
    </Flex>
  )
}
