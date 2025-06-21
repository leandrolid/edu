import type { IFile } from '@edu/framework'

export type CreateVideoInput = {
  file: IFile
  onClose: (callback: () => void) => void
}
