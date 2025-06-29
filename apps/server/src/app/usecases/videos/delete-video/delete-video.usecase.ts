import type { DeleteVideoInput } from '@app/usecases/videos/delete-video/delete-video.input'
import type { Auth } from '@domain/dtos/auth.dto'
import { Inject, Injectable, NotFoundError } from '@edu/framework'
import type { IVideoRepository } from '@infra/repositories/video/video.repository'
import type { IStorageService } from '@infra/services/storage/storage.service'

@Injectable()
export class DeleteVideoUseCase {
  constructor(
    @Inject('IVideoRepository')
    private readonly videoRepository: IVideoRepository,
    @Inject('IStorageService')
    private readonly storageService: IStorageService,
  ) {}

  async execute({ videoId }: Auth<DeleteVideoInput>) {
    const video = await this.videoRepository.findById(videoId)
    if (!video) throw new NotFoundError('Vídeo não encontrado')
    await this.storageService.deleteDirectory(video.assetId.split('/').slice(0, -1).join('/'))
    await this.videoRepository.deleteById(videoId)
    return { message: 'Vídeo apagado com sucesso' }
  }
}
