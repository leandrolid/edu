import type { IDatabaseConnection } from '@domain/persistence/connection'
import { InternalServerError, Logger } from '@edu/framework'
import { Prisma, PrismaClient } from '@prisma/client'
import { camel, get } from 'radash'

export class PrismaDatabaseConnection implements IDatabaseConnection {
  private readonly logger: Logger = new Logger('Query')
  private readonly prisma: PrismaClient

  static #instance: PrismaDatabaseConnection
  static getInstance(): PrismaDatabaseConnection {
    if (!PrismaDatabaseConnection.#instance) {
      PrismaDatabaseConnection.#instance = new PrismaDatabaseConnection()
    }
    return PrismaDatabaseConnection.#instance
  }

  constructor() {
    this.prisma = new PrismaClient({
      log: [{ level: 'query', emit: 'event' }, 'error', 'info', 'warn'],
    }).$on('query', (e) => {
      this.logger.info(`${this.prepareQuery(e.query, JSON.parse(e.params))}`)
    })
  }

  async connect(): Promise<void> {
    try {
      await this.prisma.$connect()
      this.logger.info('Database connection established successfully.')
    } catch (error) {
      this.logger.error(error)
      throw new InternalServerError('Failed to connect to the database.')
    }
  }

  async disconnect(): Promise<void> {
    try {
      await this.prisma.$disconnect()
      this.logger.info('Database connection closed successfully.')
    } catch (error) {
      this.logger.error(error)
      throw new InternalServerError('Failed to disconnect from the database.')
    }
  }

  async query<
    Model extends Prisma.ModelName,
    Action extends Prisma.PrismaAction,
    Operations extends Prisma.TypeMap['model'][Model]['operations'],
  >(
    model: Model,
    action: Action,
    // @ts-expect-error -- Prisma does not support generics for args and result types
    data: Operations[Action]['args'],
    // @ts-expect-error -- Prisma does not support generics for args and result types
  ): Promise<Operations[Action]['result']> {
    const command = get<Function>(this.prisma, `${camel(model)}.${action}`)
    if (!command) {
      throw new InternalServerError(`Command ${action} not found for model ${model}.`)
    }
    return command(data)
  }

  private prepareQuery(query: string, parameters?: any[]) {
    if (!Array.isArray(parameters) || parameters.length === 0) return query
    const paramNames = query.match(/\$(\d+)/g)
    if (!paramNames) return query
    const paramValues = parameters.reduce(
      (acc, param, index) => {
        acc[`$${index + 1}`] = this.prepareParam(param)
        return acc
      },
      {} as Record<string, string>,
    )
    return paramNames.reduce((acc, paramName) => {
      const paramValue = paramValues[paramName]
      if (paramValue !== undefined) {
        acc = acc.replace(paramName, paramValue)
      }
      return acc
    }, query)
  }

  private prepareParam(param: any) {
    if (typeof param === 'object') return JSON.stringify(param)
    if (typeof param === 'number') return param
    return `'${param}'`
  }
}
