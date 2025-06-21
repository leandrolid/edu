import { Link as LinkIcon, Upload } from '@phosphor-icons/react/dist/ssr'
import { Button, Card, DropdownMenu, Flex, Inset, Skeleton, TextField } from '@radix-ui/themes'
import Link from 'next/link'

export default async function VideosPage() {
  return (
    <Flex direction="column" gap="4">
      <Card variant="surface" style={{ width: '100%' }}>
        <Inset side="all" p="0">
          <Flex align="center" justify="between" gap="3" p="4">
            <DropdownMenu.Root>
              <DropdownMenu.Trigger>
                <Button variant="outline" color="green" size="3">
                  Vídeos
                </Button>
              </DropdownMenu.Trigger>
              <DropdownMenu.Content variant="soft">
                <DropdownMenu.Item asChild>
                  <Link href="videos/new" style={{ cursor: 'pointer' }}>
                    <Upload weight="regular" />
                    Upload
                  </Link>
                </DropdownMenu.Item>
                <DropdownMenu.Item asChild>
                  <Link href="videos/import" style={{ cursor: 'pointer' }}>
                    <LinkIcon weight="regular" />
                    Importar
                  </Link>
                </DropdownMenu.Item>
              </DropdownMenu.Content>
            </DropdownMenu.Root>

            <TextField.Root placeholder="Busque por vídeos" size="2" style={{ width: '250px' }} />
          </Flex>

          <Flex direction="column" gap="4" p="4">
            <Skeleton width="100%" height="30rem" />
          </Flex>
        </Inset>
      </Card>
    </Flex>
  )
}
