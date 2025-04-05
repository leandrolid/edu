import { auth } from '@/auth'
import { Header } from '@/components/header'
import { redirect } from 'next/navigation'

export default async function PrivateLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const isAuthenticated = await auth.isAuthenticated()
  if (!isAuthenticated) {
    return redirect('/login')
  }
  return (
    <>
      <Header />
      {children}
    </>
  )
}
