import { Header } from '@/components/header'
import { Box, Flex, Text } from '@radix-ui/themes'

export default function PrivatePage() {
  return (
    <Box>
      <Header />
      <Flex align="center" justify="center" p="4" minHeight="calc(100vh - 5rem)">
        <Text size="4" weight="bold" color="gray">
          Selecione uma organização para continuar
        </Text>
      </Flex>
    </Box>
  )
}
