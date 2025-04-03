import { isAuthenticated } from '@/auth'
import { redirect } from 'next/navigation'

export default async function PrivateLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const isAuth = await isAuthenticated()
  if (!isAuth) {
    return redirect('/login')
  }
  return <>{children}</>
}
