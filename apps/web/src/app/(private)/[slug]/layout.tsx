import { Header } from '@/components/header'
import { Navbar } from '@/components/navbar'

export default async function OrganizationLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <>
      <Header />
      <Navbar />
      {children}
    </>
  )
}
