import { VideoForm } from '@/components/contents/videos/video-form'
import { NoSSRWrapper } from '@/components/nossr-wrapper'
import { Card, Flex, Inset } from '@radix-ui/themes'

export default async function NewVideoPage() {
  return (
    <Flex direction="column" gap="4">
      <Card variant="surface" style={{ width: '100%' }}>
        <Inset side="all" p="0">
          <Flex direction="column" gap="3" p="4">
            <NoSSRWrapper>
              <VideoForm />
            </NoSSRWrapper>
          </Flex>
        </Inset>
      </Card>
    </Flex>
  )
}
