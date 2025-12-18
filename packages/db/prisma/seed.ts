import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Seeding database...')

  // Create sample profiles
  const player = await prisma.profile.upsert({
    where: { email: 'player@socio.com' },
    update: {},
    create: {
      email: 'player@socio.com',
      name: 'João Jogador',
      role: 'PLAYER',
    },
  })

  const master = await prisma.profile.upsert({
    where: { email: 'master@socio.com' },
    update: {},
    create: {
      email: 'master@socio.com',
      name: 'Maria Mestre',
      role: 'MASTER',
    },
  })

  const venueOwner = await prisma.profile.upsert({
    where: { email: 'venue@socio.com' },
    update: {},
    create: {
      email: 'venue@socio.com',
      name: 'Carlos Lojista',
      role: 'VENUE_OWNER',
    },
  })

  // Create sample venue
  const venue = await prisma.venue.create({
    data: {
      ownerId: venueOwner.id,
      name: 'Taverna do Dragão',
      description: 'Loja especializada em RPG e board games',
      address: 'Rua dos Jogos, 123',
      city: 'São Paulo',
      state: 'SP',
      zipCode: '01234-567',
    },
  })

  // Create venue table
  const table = await prisma.venueTable.create({
    data: {
      venueId: venue.id,
      name: 'Mesa Principal',
      capacity: 6,
      pricePerHour: 25.0,
    },
  })

  // Create sample session
  const session = await prisma.session.create({
    data: {
      masterId: master.id,
      venueId: venue.id,
      tableId: table.id,
      title: 'D&D 5e - A Maldição de Strahd',
      description: 'Aventura épica em Barovia',
      gameSystem: 'D&D 5e',
      maxPlayers: 5,
      price: 50.0,
      duration: 240, // 4 hours
      scheduledAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 1 week from now
    },
  })

  // Create sample adventure
  const adventure = await prisma.adventure.create({
    data: {
      title: 'O Tesouro Perdido',
      description: 'Uma aventura para iniciantes',
      price: 15.0,
      gameSystem: 'D&D 5e',
      difficulty: 2,
      duration: 180,
    },
  })

  // Create achievements
  await prisma.achievement.createMany({
    data: [
      {
        name: 'Primeiro Jogo',
        description: 'Participou da primeira sessão',
        points: 10,
      },
      {
        name: 'Mestre Iniciante',
        description: 'Mestrou a primeira sessão',
        points: 25,
      },
      {
        name: 'Colecionador',
        description: 'Comprou 5 aventuras',
        points: 50,
      },
    ],
  })

  console.log('✅ Seed completed!')
  console.log({ player, master, venueOwner, venue, session, adventure })
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