
import { PrismaClient, UserRole, SessionStatus, BookingStatus, ContractStatus } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Iniciando sementeira (seed) do Sócio do Tabuleiro...");

  // 1. Criar Usuários
  console.log("... Criando Perfis");
  
  const master = await prisma.user.upsert({
    where: { email: "mestre@exemplo.com" },
    update: {},
    create: {
      uid: "seed_master_001",
      name: "Mestre Alex",
      email: "mestre@exemplo.com",
      role: UserRole.MASTER,
      avatarUrl: "https://picsum.photos/seed/master1/200",
      founderPactStatus: ContractStatus.SIGNED,
      level: 5,
    },
  });

  const player = await prisma.user.upsert({
    where: { email: "jogador@exemplo.com" },
    update: {},
    create: {
      uid: "seed_player_001",
      name: "Aventureiro John",
      email: "jogador@exemplo.com",
      role: UserRole.PLAYER,
      avatarUrl: "https://picsum.photos/seed/player1/200",
      level: 2,
    },
  });

  const venueOwner = await prisma.user.upsert({
    where: { email: "loja@exemplo.com" },
    update: {},
    create: {
      uid: "seed_owner_001",
      name: "Dono da Taverna",
      email: "loja@exemplo.com",
      role: UserRole.VENUE,
      avatarUrl: "https://picsum.photos/seed/venue1/200",
      founderPactStatus: ContractStatus.SIGNED,
    },
  });

  // 2. Criar Local (Venue) + Mesas
  console.log("... Criando Venue e Mesas");
  const venue = await prisma.venue.create({
    data: {
      ownerId: venueOwner.uid,
      name: "Caverna do Dragão",
      address: "Rua dos RPGistas, 123 - São Paulo, SP",
      description: "O melhor espaço para sua mesa de RPG com snacks temáticos.",
      isOpen: true,
      amenities: ["Wi-Fi", "Ar Condicionado", "Lanchonete"],
      tables: {
        create: [
          { name: "Mesa VIP Masmorra", capacity: 6, pricePerHour: 20.0 },
          { name: "Mesa Central", capacity: 8, pricePerHour: 15.0 },
        ],
      },
    },
  });

  // 3. Criar Sessão
  console.log("... Criando Sessão");
  const session = await prisma.session.create({
    data: {
      masterId: master.uid,
      title: "A Maldição de Strahd",
      system: "D&D 5e",
      description: "Uma campanha épica de terror gótico nas terras de Barovia. Jogadores nível 3.",
      date: new Date(Date.now() + 86400000 * 3), // 3 dias no futuro
      price: 35.0,
      playersMax: 5,
      playersCurrent: 1,
      status: SessionStatus.PUBLISHED,
      imageUrl: "https://picsum.photos/seed/strahd/800/400",
      locationType: "VENUE",
      venueId: venue.id,
      venueName: venue.name,
      venueAddress: venue.address,
      tags: ["Horror", "Roleplay", "D&D"],
    },
  });

  // 4. Criar Reserva
  console.log("... Criando Reserva");
  await prisma.booking.create({
    data: {
      sessionId: session.id,
      playerId: player.uid,
      status: BookingStatus.CONFIRMED,
      amount: session.price,
      paymentId: "pay_mock_999",
    },
  });

  // 5. Criar Chat e Mensagens
  console.log("... Criando Chat e Mensagens");
  const chat = await prisma.chatThread.create({
    data: {
      sessionId: session.id,
      participantIds: [master.uid, player.uid],
      lastMessage: "Obrigado por aceitar minha ficha!",
      participants: {
        connect: [{ uid: master.uid }, { uid: player.uid }]
      },
      messages: {
        create: [
          { senderId: master.uid, text: "Bem-vindo à Barovia, aventureiro.", timestamp: new Date() },
          { senderId: player.uid, text: "Obrigado por aceitar minha ficha!", timestamp: new Date(Date.now() + 1000) },
        ],
      },
    },
  });

  console.log("✅ Seed finalizado com sucesso!");
}

main()
  .catch((e) => {
    console.error("❌ Erro durante o seed:", e);
    // Use casting to any to fix the TypeScript error where exit might not be detected on process type
    (process as any).exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
