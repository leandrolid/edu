import { PrismaClient } from '@prisma/client'
import chalk from 'chalk'

export const prisma = new PrismaClient({
  log: [{ level: 'query', emit: 'event' }, 'error', 'info', 'warn'],
})

prisma.$on('query', (e) => {
  console.log(chalk.blue(`[QUERY] ${prepareQuery(e.query, JSON.parse(e.params))}`))
})

function prepareQuery(query: string, parameters?: any[]) {
  if (!Array.isArray(parameters) || parameters.length === 0) return query
  const paramNames = query.match(/\$(\d+)/g)
  if (!paramNames) return query
  const paramValues = parameters.reduce(
    (acc, param, index) => {
      acc[`$${index + 1}`] = prepareParam(param)
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

function prepareParam(param: any) {
  if (typeof param === 'object') return JSON.stringify(param)
  if (typeof param === 'number') return param
  return `'${param}'`
}
