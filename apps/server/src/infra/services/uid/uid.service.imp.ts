import { Injectable } from '@edu/framework'
import type { UUIDAdapter } from '@infra/adapters/uuid/uuid.adapter'
import type { IUIDService, UuidInput } from '@infra/services/uid/uid.service'

@Injectable()
export class UIDService implements IUIDService {
  constructor(private readonly uuidAdapter: UUIDAdapter) {}

  uuid({ version = 'v7' }: UuidInput = {}): string {
    if (version === 'v7') {
      return this.uuidAdapter.v7()
    }
    throw new Error(`Unsupported UUID version: ${version}`)
  }
}
