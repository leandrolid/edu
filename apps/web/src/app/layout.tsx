import type { Metadata } from 'next'
import './globals.css'

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
      <body>{children}</body>
    </html>
  )
}
