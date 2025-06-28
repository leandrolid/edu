import { createDecorator, Scope } from '@edu/framework'
import { PrismaDatabaseConnection } from '@infra/database/connections/connection.imp'
import { Repository } from '@infra/database/connections/repository.imp'
import type { Prisma } from '@prisma/client'

export function InjectRepository(modelName: Prisma.ModelName) {
  return createDecorator(`BaseRepository<${modelName}>`, {
    scope: Scope.Singleton,
    useFactory: () => {
      const connection = PrismaDatabaseConnection.getInstance()
      return new Repository(connection, modelName)
    },
  })
}
