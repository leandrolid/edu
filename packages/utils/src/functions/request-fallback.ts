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
    console.error(error)
    return onError?.(error)
  }
}
