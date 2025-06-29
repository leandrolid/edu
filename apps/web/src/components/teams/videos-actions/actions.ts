'use server'
import { auth } from '@/auth'
import { HttpError } from '@/http/errors/http.error'
import { deleteVideo } from '@/http/services/videos/delete-video'

export async function deleteVideoAction(videoId: string) {
  try {
    const slug = await auth.getCurrentOrganization()
    await deleteVideo({ slug: slug!, videoId })
    return { success: true, message: null, errors: null }
  } catch (error) {
    if (error instanceof HttpError) {
      return { success: false, message: error.message, errors: error.errors }
    }
    return { success: false, message: 'Por favor, tente novamente mais tarde.', errors: null }
  }
}
