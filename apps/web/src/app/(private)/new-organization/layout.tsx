import { Header } from '@/components/navigation/header'

export default async function NewOrganizationLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <>
      <Header />
      {children}
    </>
  )
}
