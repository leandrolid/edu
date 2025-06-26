export interface IUIDService {
  uuid(input?: UuidInput): string
}

export type UuidInput = {
  version?: 'v7'
}
