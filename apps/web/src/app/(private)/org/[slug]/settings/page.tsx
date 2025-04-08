import { Button, Card, Checkbox, Flex, Heading, Separator, Text, TextField } from '@radix-ui/themes'

export default async function SettingsPage() {
  return (
    <>
      <Card variant="surface" style={{ width: '100%', padding: 0 }}>
        <form>
          <Flex direction="column" gap="4" p="6">
            <Heading as="h6" size="4" mb="4">
              Configurações básicas
            </Heading>

            <Flex direction="column" gap="2">
              <Text as="label" size="2" htmlFor="organizationName">
                Nome da organização
              </Text>
              <TextField.Root
                id="organizationName"
                name="organizationName"
                placeholder="Minha organização"
                size="2"
              />
            </Flex>

            <Flex direction="column" gap="2">
              <Text as="label" size="2" htmlFor="organizationDomain">
                Domínio da organização
              </Text>
              <TextField.Root
                id="organizationDomain"
                name="organizationDomain"
                placeholder="exemplo.com"
                size="2"
              />
            </Flex>

            <Flex direction="column" gap="2">
              <Text as="label" size="2" htmlFor="organizationAutoJoin">
                <Checkbox id="organizationAutoJoin" name="organizationAutoJoin" mr="1" />
                Auto adicionar novos membros pelo Domínio
              </Text>
            </Flex>
          </Flex>

          <Separator orientation="horizontal" size="4" />

          <Flex p="5">
            <Button variant="solid" size="2" ml="auto">
              Salvar
            </Button>
          </Flex>
        </form>
      </Card>
    </>
  )
}
