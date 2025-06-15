import { createSlug } from '@edu/utils'
import { faker } from '@faker-js/faker/locale/pt_BR'
import { prisma } from '@infra/database/connections/prisma.connection'
import { hash } from 'bcrypt'

const main = async () => {
  await prisma.member.deleteMany()
  await prisma.organization.deleteMany()
  await prisma.user.deleteMany()

  const passwordHash = await hash('12345678', 2)
  await prisma.$transaction(async (prisma) => {
    const users = await prisma.user.createManyAndReturn({
      data: [
        {
          name: 'Leandro Augusto',
          email: 'leandro.augusto@email.com',
          avatarUrl: 'https://i.pravatar.cc/400?img=33',
          passwordHash,
          owner: true,
        },
        ...Array.from({ length: 50 }).map(() => ({
          name: faker.person.fullName(),
          email: faker.internet.email(),
          avatarUrl: faker.image.avatar(),
          passwordHash,
        })),
      ],
    })
    const organizations = await Promise.all(
      Array.from({ length: 3 }).map(async () => {
        const organizationName = faker.company.name()
        const user = faker.helpers.arrayElement(users)
        return await prisma.organization.create({
          include: { teams: true },
          data: {
            name: organizationName,
            slug: createSlug(organizationName),
            avatarUrl: faker.image.avatar(),
            domain: faker.internet.domainName(),
            ownerId: user.id,
            shouldAttachUserByDomain: false,
            teams: {
              createMany: {
                data: [
                  {
                    name: 'Administrador',
                    slug: createSlug('Administrador'),
                    description: `Administrador padrão (${createSlug(organizationName)})`,
                    roles: ['ORGANIZATION_ADMIN', 'TEAM_ADMIN', 'MEMBER_ADMIN'],
                    ownerId: user.id,
                  },
                  {
                    name: 'Financeiro',
                    slug: createSlug('Financeiro'),
                    description: `Financeiro padrão (${createSlug(organizationName)})`,
                    roles: ['ORGANIZATION_BILLING'],
                    ownerId: user.id,
                  },
                  {
                    name: 'Professor',
                    slug: createSlug('Professor'),
                    description: `Professor padrão (${createSlug(organizationName)})`,
                    roles: ['TEAM_MEMBER'],
                    ownerId: user.id,
                  },
                ],
              },
            },
          },
        })
      }),
    )

    await Promise.all(
      organizations.map(async (organization) => {
        await prisma.member.createMany({
          data: users.map((user, index) => {
            const team = organization.teams[index % 3]!
            return {
              userId: user.id,
              teamId: team.id,
              roles: team.roles,
              organizationId: organization.id,
              slug: organization.slug,
            }
          }),
        })
      }),
    )
  })
}

main()
