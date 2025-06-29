import { useMutation } from '@tanstack/react-query'

export function useAppMutation<Output, Input>({
  id,
  mutationFn,
  onSuccess,
  onError,
}: {
  id: string
  mutationFn: (input: Input) => Promise<Output>
  onSuccess?: (data: Output) => void
  onError?: (error: Error) => void
}): {
  isSuccess: boolean
  isPending: boolean
  isError: boolean
  request: (input: Input) => void
  requestAsync: (input: Input) => Promise<Output>
  output?: Output
} {
  const {
    isSuccess,
    isPending,
    isError,
    mutate: request,
    mutateAsync: requestAsync,
    data: output,
  } = useMutation<Output, Error, Input>({
    mutationKey: [id],
    mutationFn: (input: Input) => mutationFn(input),
    onSuccess: (data) => {
      onSuccess?.(data)
    },
    onError: (error) => {
      onError?.(error)
    },
  })
  return {
    isSuccess,
    isPending,
    isError,
    request,
    requestAsync,
    output,
  }
}
