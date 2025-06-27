import type { Video } from '@prisma/client'

export interface IVideoRepository {
  create(input: CreateVideoInput): Promise<Video>
}

export type CreateVideoInput = {
  id?: string
  title: string
  ownerId: string
  organizationId: string
  assetId: string
  baseUrl: string
  duration: number
  thumbnail: string
}
