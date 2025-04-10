'use server'

import { auth } from '@/auth'
import { redirect } from 'next/navigation'

export const signOut = async () => {
  const slug = await auth.getCurrentOrganization()
  await auth.signOut()
  redirect(`/${slug}/login`)
}
