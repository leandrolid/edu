'use client'

import { QueryClientProvider } from '@tanstack/react-query'
import { ReactNode } from 'react'

import { queryClient } from '@/lib/react-query'
import { Theme } from '@radix-ui/themes'

export function Providers({ children }: { children: ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>
      <Theme appearance="dark" accentColor="indigo">
        {children}
      </Theme>
    </QueryClientProvider>
  )
}
