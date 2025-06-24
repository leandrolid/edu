import { EventEmitter } from 'node:events'

export const EVENT_SERVICE = 'EVENTS_SERVICE'
const EVENT_EMITTER = new EventEmitter()

export class EventsService implements IEventsService {
  async emit<T>(event: string, payload: T): Promise<void> {
    console.log(`Event emitted: ${event}`, payload)
    EVENT_EMITTER.emit(event, payload)
  }

  async on<T>(event: string, listener: (payload: T) => void): Promise<void> {
    EVENT_EMITTER.on(event, listener)
  }
}

export interface IEventsService {
  emit<T>(event: string, payload: T): Promise<void>
  on<T>(event: string, listener: (payload: T) => void): Promise<void>
}
