import { StreamPlayer } from '@/components/materials/stream-player'
import { getVideo } from '@/http/services/materials/get-video'
import { requestFallback } from '@edu/utils'
import { Card, Flex, Heading, Inset } from '@radix-ui/themes'
import { redirect } from 'next/navigation'

export default async function VideoPage({
  params,
}: {
  params: Promise<{ slug: string; videoId: string }>
}) {
  const { slug, videoId } = await params
  const { data: video } = await requestFallback({
    request: () => getVideo({ videoId, slug }),
    onError: () => redirect(`/${slug}/teams`),
  })
  return (
    <Flex direction="column" gap="4">
      <Card variant="surface" style={{ width: '100%' }}>
        <Inset side="all" p="0">
          <Flex direction="column" gap="3" p="4">
            <Heading as="h5" size="4">
              Editar vídeo
            </Heading>

            <StreamPlayer thumbnail={video.thumbnail} manifestUrl={video.url} />
          </Flex>
        </Inset>
      </Card>
    </Flex>
  )
}
