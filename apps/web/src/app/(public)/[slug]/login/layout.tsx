import LoginLayout from '@/app/(public)/login/layout'

export default function OrganizationLoginLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return <LoginLayout>{children}</LoginLayout>
}
