export class ServerError extends Error {
  constructor(
    public readonly code: number,
    public readonly message: string,
    public readonly cause?: Record<string, any>,
  ) {
    super(message, { cause })
    this.name = this.constructor.name
  }
}
