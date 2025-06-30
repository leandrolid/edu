import type { IFile } from '@edu/framework'

export type CreateVideosInput = {
  videos: {
    title: string
    description: string
    duration?: number
    file: IFile
    tags: string[]
  }[]
}
