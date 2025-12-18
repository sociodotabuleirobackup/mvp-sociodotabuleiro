import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Iniciando seed do banco de dados...')

  // Criar usuários de exemplo
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

  const store = await prisma.user.upsert({
    where: { email: 'store@example.com' },
    update: {},
    create: {
      email: 'store@example.com',
      name: 'Loja RPG',
      role: 'STORE',
      storeProfile: {
        create: {
          storeName: 'RPG Store',
          cnpj: '12.345.678/0001-90',
          address: 'Rua dos Jogos, 123',
          phone: '(11) 99999-9999',
        },
      },
    },
  })

  console.log('✅ Seed concluído!')
  console.log({ player, master, store })
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