import {
  Controller,
  Docs,
  Get,
  HttpStatusCode,
  Logger,
  MiddleWares,
  ResponseNode,
  Stream,
  type IResponseNode,
} from '@edu/framework'
import { FsStorageAdapter } from '@infra/adapters/fs-storage/fs-storage.adapter'
import { JwtMiddleware } from '@infra/http/middlewares/jwt.middleware'
import { resolve } from 'path'

@Docs({
  title: 'Get network speed',
  tags: ['Status'],
})
@Controller('/speed')
@Stream()
@MiddleWares(JwtMiddleware)
export class SpeedController {
  private readonly storageService: FsStorageAdapter
  private readonly logger = new Logger('SpeedController')
  constructor() {
    this.storageService = new FsStorageAdapter(resolve(__dirname, '../../../../public'))
  }

  @Get('/')
  async execute(@ResponseNode() response: IResponseNode) {
    const file = this.storageService.getFile('music.mp3')
    response.writeHead(HttpStatusCode.OK, {
      'Content-Type': 'audio/mp3',
      'Content-Length': file.fileSize,
      'Access-Control-Allow-Origin': '*',
    })
    const stream = file.toStream()
    stream.on('error', (error) => {
      this.logger.error('Stream error:', error)
      response.writeHead(500, { 'Content-Type': 'text/plain' })
      response.end('Internal Server Error')
    })
    stream.on('end', () => this.logger.debug('Stream ended successfully'))
    return stream.pipe(response)
  }
}
