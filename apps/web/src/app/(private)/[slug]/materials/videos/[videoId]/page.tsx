import { EditVideoForm } from '@/components/materials/edit-video-form'
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
          <Heading as="h5" size="4" m="4">
            Editar vídeo
          </Heading>

          <EditVideoForm
            title={video.title}
            description={video.description || ''}
            url={video.url}
            thumbnail={video.thumbnail}
            tags={video.tags}
            courses={[]}
          />
        </Inset>
      </Card>
    </Flex>
  )
}
