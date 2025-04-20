'use server'

import { auth } from '@/auth'
import { redirect } from 'next/navigation'

export const signOut = async () => {
  await auth.signOut()
  redirect(`/login`)
}
