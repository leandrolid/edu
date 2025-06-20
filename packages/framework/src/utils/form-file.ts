import type { MultipartFile } from '@fastify/multipart'
import type { IFile, IStream } from '../interfaces'

export class FormFile implements IFile {
  public filename: string
  public encoding: string
  public mimetype: string

  constructor(private readonly field: MultipartFile) {
    this.filename = field.filename
    this.encoding = field.encoding
    this.mimetype = field.mimetype
  }

  getBuffer(): Promise<Buffer> {
    return this.field.toBuffer()
  }
  getFileStream(): IStream {
    return this.field.file
  }
}
