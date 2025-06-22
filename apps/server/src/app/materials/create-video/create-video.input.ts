import type { IFile } from '@edu/framework'

export type CreateVideoInput = {
  slug: string
  file: IFile
  onClose: (callback: () => void) => void
}
