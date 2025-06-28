import type { Video } from '@prisma/client'

export interface IVideoRepository {
  createOne(input: CreateVideoInput): Promise<Video>
  findManyAndCount(input: FindManyVideosAndCountInput): Promise<FindManyVideosAndCountOutput>
  findById(id: string): Promise<Video | null>
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

export type FindManyVideosAndCountInput = {
  organizationId: string
  search?: string
  page: number
  pageSize: number
}

export type FindManyVideosAndCountOutput = {
  count: number
  videos: Video[]
}
