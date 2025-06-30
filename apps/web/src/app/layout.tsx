import '@radix-ui/themes/styles.css'
import './globals.css'

import { Providers } from '@/app/providers'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Edu',
  description: 'Full-stack SaaS with multi-tenant & RBAC.',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="pt-BR">
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}
