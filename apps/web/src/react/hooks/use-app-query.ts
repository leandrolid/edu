import { useQuery } from '@tanstack/react-query'

export function useAppQuery<Output, Input>({
  id,
  input,
  queryFn,
  initialData,
}: {
  id: string
  input: Input
  queryFn: (input: Input) => Promise<Output>
  initialData?: Output
}): {
  isSuccess: boolean
  isPending: boolean
  isFirstLoading: boolean
  isError: boolean
  data?: Output
} {
  const {
    data,
    isSuccess,
    isFetching: isPending,
    isLoading: isFirstLoading,
    isError,
  } = useQuery<Output, Error, Output, [string, Input]>({
    queryKey: [id, input],
    queryFn: () => queryFn(input),
    initialData,
  })
  return {
    isSuccess,
    isPending,
    isFirstLoading,
    isError,
    data,
  }
}
