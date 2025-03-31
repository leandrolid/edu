import { prisma } from '@infra/database/connections/prisma.connection'
import { hash } from 'bcrypt'

const main = async () => {
  await prisma.member.deleteMany()
  await prisma.organization.deleteMany()
  await prisma.user.deleteMany()

  const passwordHash = await hash('12345678', 2)
  prisma.$transaction(async (prisma) => {
    const [user1] = await prisma.user.createManyAndReturn({
      data: [
        {
          name: 'John Doe',
          email: 'johndoe@example.com',
          avatarUrl: 'https://example.com/avatar.jpg',
          passwordHash,
          role: 'OWNER',
        },
      ],
    })
    const organization1 = await prisma.organization.create({
      data: {
        name: 'Example Organization',
        slug: 'example-organization',
        avatarUrl: 'https://example.com/org-avatar.jpg',
        domain: 'example.com',
        ownerId: user1!.id,
        shouldAttachUserByDomain: true,
      },
    })
    await prisma.member.createMany({
      data: [
        {
          organizationId: organization1.id,
          userId: user1!.id,
          role: user1!.role,
        },
      ],
    })
  })
}

main()
