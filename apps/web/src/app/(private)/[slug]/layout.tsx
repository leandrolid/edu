import { Header } from '@/components/navigation/header'
import { Navbar } from '@/components/navigation/navbar'

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
