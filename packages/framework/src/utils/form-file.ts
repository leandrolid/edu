import type { MultipartFile } from '@fastify/multipart'
import type { IFile, IReadStream } from '../interfaces'

export class FormFile implements IFile {
  public filename: string
  public encoding: string
  public mimetype: string

  constructor(private readonly field: MultipartFile) {
    this.filename = field.filename
    this.encoding = field.encoding
    this.mimetype = field.mimetype
  }

  toBuffer(): Promise<Buffer> {
    return this.field.toBuffer()
  }

  toStream(): IReadStream {
    return this.field.file
  }
}
