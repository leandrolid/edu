import { createSlug } from '@edu/utils'
import { faker } from '@faker-js/faker/locale/pt_BR'
import { prisma } from '@infra/database/connections/prisma.connection'
import { hash } from 'bcrypt'

const main = async () => {
  await prisma.member.deleteMany()
  await prisma.organization.deleteMany()
  await prisma.user.deleteMany()

  const passwordHash = await hash('12345678', 2)
  prisma.$transaction(async (prisma) => {
    const [user1, user2, user3] = await prisma.user.createManyAndReturn({
      data: [
        {
          name: 'Leandro Augusto',
          email: 'leandro.augusto@email.com',
          avatarUrl: 'https://avatar.iran.liara.run/public/boy',
          passwordHash,
        },
        {
          name: faker.person.fullName(),
          email: faker.internet.email(),
          avatarUrl: faker.image.avatar(),
          passwordHash,
        },
        {
          name: faker.person.fullName(),
          email: faker.internet.email(),
          avatarUrl: faker.image.avatar(),
          passwordHash,
        },
      ],
    })
    const [organization1, organization2, organization3] =
      await prisma.organization.createManyAndReturn({
        data: [
          {
            name: faker.company.name(),
            slug: createSlug(faker.company.name()),
            avatarUrl: faker.image.avatar(),
            domain: faker.internet.domainName(),
            ownerId: user1!.id,
            shouldAttachUserByDomain: true,
          },
          {
            name: faker.company.name(),
            slug: createSlug(faker.company.name()),
            avatarUrl: faker.image.avatar(),
            domain: faker.internet.domainName(),
            ownerId: user1!.id,
            shouldAttachUserByDomain: true,
          },
          {
            name: faker.company.name(),
            slug: createSlug(faker.company.name()),
            avatarUrl: faker.image.avatar(),
            domain: faker.internet.domainName(),
            ownerId: user1!.id,
            shouldAttachUserByDomain: true,
          },
        ],
      })
    const [team1, team2, team3] = await prisma.team.createManyAndReturn({
      data: [
        {
          name: 'Admin',
          slug: 'admin-team',
          organizationId: organization1!.id,
          roles: ['OWNER'],
          ownerId: user1!.id,
        },
        {
          name: 'Admin',
          slug: 'admin-team',
          organizationId: organization2!.id,
          roles: ['ORGANIZATION_CONTRIBUTOR'],
          ownerId: user1!.id,
        },
        {
          name: 'Admin',
          slug: 'admin-team',
          organizationId: organization3!.id,
          roles: ['ORGANIZATION_BILLING'],
          ownerId: user1!.id,
        },
      ],
    })
    await prisma.member.createMany({
      data: [
        {
          userId: user1!.id,
          teamId: team1!.id,
          organizationId: organization1!.id,
          slug: organization1!.slug,
          roles: team1!.roles,
        },
        {
          userId: user1!.id,
          teamId: team2!.id,
          organizationId: organization2!.id,
          slug: organization2!.slug,
          roles: team2!.roles,
        },
        {
          userId: user1!.id,
          teamId: team3!.id,
          organizationId: organization3!.id,
          slug: organization3!.slug,
          roles: team3!.roles,
        },
        {
          userId: user2!.id,
          teamId: team1!.id,
          organizationId: organization1!.id,
          slug: organization1!.slug,
          roles: ['ORGANIZATION_CONTRIBUTOR'],
        },
        {
          userId: user2!.id,
          teamId: team2!.id,
          organizationId: organization2!.id,
          slug: organization2!.slug,
          roles: ['ORGANIZATION_MEMBER'],
        },
        {
          userId: user2!.id,
          teamId: team3!.id,
          organizationId: organization3!.id,
          slug: organization3!.slug,
          roles: ['ORGANIZATION_BILLING'],
        },
        {
          userId: user3!.id,
          teamId: team1!.id,
          organizationId: organization1!.id,
          slug: organization1!.slug,
          roles: ['ORGANIZATION_CONTRIBUTOR'],
        },
        {
          userId: user3!.id,
          teamId: team2!.id,
          organizationId: organization2!.id,
          slug: organization2!.slug,
          roles: ['ORGANIZATION_MEMBER'],
        },
        {
          userId: user3!.id,
          teamId: team3!.id,
          organizationId: organization3!.id,
          slug: organization3!.slug,
          roles: ['ORGANIZATION_BILLING'],
        },
      ],
    })
  })
}

main()
