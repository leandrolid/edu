export async function errorBoundary<Input, Output>({
  input,
  request,
  onError,
}: {
  input: Input
  request: (inp: Input) => Promise<Output>
  onError: (error: unknown) => never
}) {
  try {
    return await request(input)
  } catch (error) {
    console.error(error)
    return onError?.(error)
  }
}
