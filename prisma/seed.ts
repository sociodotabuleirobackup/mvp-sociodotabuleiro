import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  const player = await prisma.user.upsert({
    where: { email: 'player@example.com' },
    update: {},
    create: {
      email: 'player@example.com',
      name: 'João Jogador',
      role: 'PLAYER',
    },
  })

  const master = await prisma.user.upsert({
    where: { email: 'master@example.com' },
    update: {},
    create: {
      email: 'master@example.com',
      name: 'Maria Mestre',
      role: 'MASTER',
      masterProfile: {
        create: {
          bio: 'Mestre experiente em D&D 5e',
          experience: 5,
          rating: 4.8,
          totalGames: 50,
        },
      },
    },
  })

  console.log({ player, master })
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })