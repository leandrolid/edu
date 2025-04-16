import { Flex, Skeleton } from '@radix-ui/themes'

export const MemberListSkeleton = () => {
  return (
    <Flex direction="column" gap="1">
      {Array.from({ length: 10 }, (_, index) => (
        <Skeleton key={index} loading style={{ width: '100%', height: '3rem', borderRadius: 0 }} />
      ))}
    </Flex>
  )
}
