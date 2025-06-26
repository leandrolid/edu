import { Injectable } from '@edu/framework'
import { v7, validate } from 'uuid'

@Injectable()
export class UUIDAdapter {
  v7() {
    return v7()
  }

  validate(uuid: string) {
    return validate(uuid)
  }
}
