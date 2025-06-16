import { isObject } from 'radash'

export async function requestFallback<Output>({
  request,
  onError,
}: {
  request: () => Promise<Output>
  onError: (error: unknown) => never | Output
}) {
  try {
    return await request()
  } catch (error) {
    if (isObject(error) && !Reflect.has(error, 'status')) {
      console.error(error)
    }
    return onError?.(error)
  }
}
