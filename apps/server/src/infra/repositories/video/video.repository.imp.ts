import { Injectable } from '@edu/framework'
import { prisma } from '@infra/database/connections/prisma.connection'
import type { CreateVideoInput, IVideoRepository } from '@infra/repositories/video/video.repository'
import type { Video } from '@prisma/client'

@Injectable({
  token: 'IVideoRepository',
})
export class VideoRepository implements IVideoRepository {
  async create(input: CreateVideoInput): Promise<Video> {
    return prisma.video.create({
      data: {
        id: input.id,
        title: input.title,
        ownerId: input.ownerId,
        organizationId: input.organizationId,
        assetId: input.assetId,
        baseUrl: input.baseUrl,
        duration: input.duration,
        thumbnail: input.thumbnail,
      },
    })
  }
}
