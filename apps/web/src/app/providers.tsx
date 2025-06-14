'use client'

import { QueryClientProvider } from '@tanstack/react-query'
import { ReactNode } from 'react'

import { ToastProvider } from '@/components/toast'
import { queryClient } from '@/lib/react-query'
import { Theme, ThemeProps } from '@radix-ui/themes'
import { getCookie } from 'cookies-next'

export function Providers({ children }: { children: ReactNode }) {
  const appearance = getCookie('appearance') ?? 'dark'
  return (
    <QueryClientProvider client={queryClient}>
      <Theme
        appearance={appearance as ThemeProps['appearance']}
        accentColor="indigo"
        panelBackground="translucent"
      >
        {children}
        <ToastProvider />
      </Theme>
    </QueryClientProvider>
  )
}
