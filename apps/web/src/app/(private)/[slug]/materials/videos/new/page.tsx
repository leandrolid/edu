import { VideoForm } from '@/components/materials/videos/video-form'
import { Card, Flex, Heading, Inset } from '@radix-ui/themes'

export default async function NewVideoPage() {
  return (
    <Flex direction="column" gap="4">
      <Card variant="surface" style={{ width: '100%' }}>
        <Inset side="all" p="0">
          <Flex direction="column" gap="3" p="4">
            <Heading as="h5" size="4">
              Criar novo vídeo
            </Heading>

            <VideoForm />
          </Flex>
        </Inset>
      </Card>
    </Flex>
  )
}
