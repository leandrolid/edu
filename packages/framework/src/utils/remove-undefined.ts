export function removeUndefined<T extends Record<string, unknown>>(obj: T): NonUndefined<T> {
  return Object.entries(obj).reduce((acc, [key, value]) => {
    if (!value) return acc
    return { ...acc, [key]: value }
  }, {} as NonUndefined<T>)
}

type NonUndefined<T> = {
  [K in keyof T]: T[K] extends undefined ? never : T[K]
}
