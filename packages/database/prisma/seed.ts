import {
  PrismaClient,
  UserRole,
  SessionStatus,
  BookingStatus,
  LocationType,
  ChatType,
  MessageType,
  NotificationType,
  FoodCategory,
  PaymentStatus,
  PaymentMethod,
} from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seed...');

  // ===== USERS =====
  console.log('👥 Creating users...');

  const master = await prisma.user.upsert({
    where: { email: 'mestre@sociodotabuleiro.com' },
    update: {},
    create: {
      email: 'mestre@sociodotabuleiro.com',
      name: 'Alex Dungeon Master',
      avatar:
        'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
      role: UserRole.MASTER,
      phone: '+5511999887766',
      cpf: '12345678901',
    },
  });

  const player = await prisma.user.upsert({
    where: { email: 'jogador@sociodotabuleiro.com' },
    update: {},
    create: {
      email: 'jogador@sociodotabuleiro.com',
      name: 'João Aventureiro',
      avatar:
        'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
      role: UserRole.PLAYER,
      phone: '+5511888776655',
      cpf: '98765432100',
    },
  });

  const storeOwner = await prisma.user.upsert({
    where: { email: 'loja@sociodotabuleiro.com' },
    update: {},
    create: {
      email: 'loja@sociodotabuleiro.com',
      name: 'Maria Lojista',
      avatar:
        'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face',
      role: UserRole.STORE,
      phone: '+5511777665544',
      cpf: '11122233344',
    },
  });

  // ===== PROFILES =====
  console.log('📋 Creating profiles...');

  const masterProfile = await prisma.masterProfile.upsert({
    where: { userId: master.id },
    update: {},
    create: {
      userId: master.id,
      bio: 'Mestre experiente com mais de 10 anos narrando aventuras épicas. Especialista em D&D 5e, Pathfinder e sistemas nacionais.',
      experience: 10,
      rating: 4.8,
      totalGames: 156,
      specialties: ['D&D 5e', 'Pathfinder', 'Tormenta20', 'Call of Cthulhu'],
    },
  });

  const storeProfile = await prisma.storeProfile.upsert({
    where: { userId: storeOwner.id },
    update: {},
    create: {
      userId: storeOwner.id,
      storeName: 'Caverna do Dragão',
      cnpj: '12.345.678/0001-90',
      address: 'Rua dos Aventureiros, 123 - Vila Madalena, São Paulo - SP',
      phone: '+5511999887766',
      latitude: -23.5505,
      longitude: -46.6333,
    },
  });

  // ===== VENUE & TABLES =====
  console.log('🏪 Creating venue and tables...');

  const venue = await prisma.venue.upsert({
    where: { id: 'venue-caverna-dragao' },
    update: {},
    create: {
      id: 'venue-caverna-dragao',
      name: 'Caverna do Dragão - Espaço Gamer',
      description:
        'Ambiente aconchegante para suas aventuras de RPG com mesas temáticas e cardápio especial.',
      address: 'Rua dos Aventureiros, 123 - Vila Madalena, São Paulo - SP',
      latitude: -23.5505,
      longitude: -46.6333,
      capacity: 24,
      amenities: [
        'wifi',
        'parking',
        'food',
        'drinks',
        'air_conditioning',
        'sound_system',
      ],
      storeId: storeProfile.id,
    },
  });

  const table1 = await prisma.table.upsert({
    where: {
      venueId_number: {
        venueId: venue.id,
        number: 'Mesa 1',
      },
    },
    update: {},
    create: {
      number: 'Mesa 1',
      capacity: 6,
      venueId: venue.id,
    },
  });

  const _table2 = await prisma.table.upsert({
    where: {
      venueId_number: {
        venueId: venue.id,
        number: 'Mesa 2',
      },
    },
    update: {},
    create: {
      number: 'Mesa 2',
      capacity: 8,
      venueId: venue.id,
    },
  });

  // ===== SESSIONS =====
  console.log('🎲 Creating sessions...');

  const sessionPresencial = await prisma.session.upsert({
    where: { id: 'session-strahd-presencial' },
    update: {},
    create: {
      id: 'session-strahd-presencial',
      title: 'A Maldição de Strahd - Capítulo 1',
      description:
        'Uma aventura sombria nas terras de Barovia. Os heróis chegam a uma terra amaldiçoada onde o sol nunca brilha e um vampiro ancestral governa com punho de ferro.',
      gameSystem: 'D&D 5e',
      maxPlayers: 5,
      price: 45.0,
      duration: 240, // 4 hours
      status: SessionStatus.OPEN,
      locationType: LocationType.VENUE,
      scheduledAt: new Date('2025-01-25T14:00:00Z'),
      masterId: masterProfile.id,
      storeId: storeProfile.id,
      venueId: venue.id,
      tableId: table1.id,
    },
  });

  const _sessionOnline = await prisma.session.upsert({
    where: { id: 'session-cyberpunk-online' },
    update: {},
    create: {
      id: 'session-cyberpunk-online',
      title: 'Cyberpunk RED - Ruas de Night City',
      description:
        'Bem-vindos a Night City, onde a tecnologia e a humanidade se chocam. Vocês são edgerunners tentando sobreviver nas ruas perigosas desta metrópole cyberpunk.',
      gameSystem: 'Cyberpunk RED',
      maxPlayers: 4,
      price: 35.0,
      duration: 180, // 3 hours
      status: SessionStatus.OPEN,
      locationType: LocationType.ONLINE,
      scheduledAt: new Date('2025-01-27T19:00:00Z'),
      masterId: masterProfile.id,
    },
  });

  // ===== BOOKING =====
  console.log('📝 Creating booking...');

  const booking = await prisma.booking.upsert({
    where: {
      userId_sessionId: {
        userId: player.id,
        sessionId: sessionPresencial.id,
      },
    },
    update: {},
    create: {
      userId: player.id,
      sessionId: sessionPresencial.id,
      status: BookingStatus.CONFIRMED,
      amount: 45.0,
      paymentId: 'asaas_pay_123456789',
    },
  });

  // ===== PAYMENT =====
  console.log('💳 Creating payment...');

  await prisma.payment.upsert({
    where: { id: 'payment-booking-strahd' },
    update: {},
    create: {
      id: 'payment-booking-strahd',
      amount: 45.0,
      currency: 'BRL',
      status: PaymentStatus.COMPLETED,
      method: PaymentMethod.PIX,
      externalId: 'asaas_pay_123456789',
      description: 'Pagamento da sessão: A Maldição de Strahd - Capítulo 1',
      bookingId: booking.id,
    },
  });

  // ===== CHAT & MESSAGES =====
  console.log('💬 Creating chat and messages...');

  const chat = await prisma.chat.upsert({
    where: { id: 'chat-session-strahd' },
    update: {},
    create: {
      id: 'chat-session-strahd',
      type: ChatType.SESSION,
      name: 'Chat - A Maldição de Strahd',
      sessionId: sessionPresencial.id,
    },
  });

  const messages = [
    {
      id: 'msg-1',
      content:
        'Pessoal, estou muito animado para nossa sessão! Já preparei meu personagem.',
      userId: player.id,
    },
    {
      id: 'msg-2',
      content:
        'Que bom! Lembrem-se de trazer as fichas impressas. Vamos começar pontualmente às 14h.',
      userId: master.id,
    },
    {
      id: 'msg-3',
      content:
        'Perfeito! A mesa já está reservada e o cardápio especial estará disponível.',
      userId: storeOwner.id,
    },
  ];

  for (const msg of messages) {
    await prisma.chatMessage.upsert({
      where: { id: msg.id },
      update: {},
      create: {
        id: msg.id,
        content: msg.content,
        type: MessageType.TEXT,
        userId: msg.userId,
        chatId: chat.id,
      },
    });
  }

  // ===== NOTIFICATIONS =====
  console.log('🔔 Creating notifications...');

  await prisma.notification.upsert({
    where: { id: 'notif-booking-confirmed' },
    update: {},
    create: {
      id: 'notif-booking-confirmed',
      title: 'Reserva Confirmada!',
      message:
        'Sua vaga na sessão "A Maldição de Strahd" foi confirmada. Nos vemos no sábado às 14h!',
      type: NotificationType.BOOKING_CONFIRMED,
      userId: player.id,
      data: {
        sessionId: sessionPresencial.id,
        sessionTitle: sessionPresencial.title,
        scheduledAt: sessionPresencial.scheduledAt,
      },
    },
  });

  await prisma.notification.upsert({
    where: { id: 'notif-payment-received' },
    update: {},
    create: {
      id: 'notif-payment-received',
      title: 'Pagamento Recebido',
      message:
        'Recebemos o pagamento de R$ 45,00 referente à sessão "A Maldição de Strahd".',
      type: NotificationType.PAYMENT_RECEIVED,
      userId: master.id,
      data: {
        amount: 45.0,
        sessionId: sessionPresencial.id,
      },
    },
  });

  // ===== FOOD MENU =====
  console.log('🍕 Creating food menu...');

  const foodMenu = await prisma.foodMenu.upsert({
    where: { id: 'menu-caverna-dragao' },
    update: {},
    create: {
      id: 'menu-caverna-dragao',
      name: 'Cardápio Gamer',
      storeId: storeProfile.id,
    },
  });

  const foodItems = [
    {
      id: 'item-pizza-dragao',
      name: 'Pizza do Dragão',
      description:
        'Pizza especial com calabresa, queijo e pimenta (para os corajosos!)',
      price: 32.9,
      category: FoodCategory.MAIN_COURSE,
    },
    {
      id: 'item-poção-mana',
      name: 'Poção de Mana',
      description:
        'Refrigerante azul energético para recuperar sua energia mágica',
      price: 8.5,
      category: FoodCategory.BEVERAGE,
    },
    {
      id: 'item-nachos-taverna',
      name: 'Nachos da Taverna',
      description: 'Nachos crocantes com queijo derretido e guacamole',
      price: 18.9,
      category: FoodCategory.APPETIZER,
    },
  ];

  for (const item of foodItems) {
    await prisma.foodItem.upsert({
      where: { id: item.id },
      update: {},
      create: {
        ...item,
        menuId: foodMenu.id,
      },
    });
  }

  // ===== ACHIEVEMENTS =====
  console.log('🏆 Creating achievements...');

  const achievements = [
    {
      id: 'achievement-first-session',
      name: 'Primeira Aventura',
      description: 'Participou da sua primeira sessão de RPG',
      icon: '🎲',
      points: 100,
    },
    {
      id: 'achievement-master-debut',
      name: 'Mestre Iniciante',
      description: 'Narrou sua primeira sessão como Mestre',
      icon: '🎭',
      points: 200,
    },
    {
      id: 'achievement-venue-host',
      name: 'Anfitrião',
      description: 'Hospedou sua primeira sessão no seu estabelecimento',
      icon: '🏪',
      points: 150,
    },
  ];

  for (const achievement of achievements) {
    await prisma.achievement.upsert({
      where: { id: achievement.id },
      update: {},
      create: achievement,
    });
  }

  // ===== USER ACHIEVEMENTS =====
  console.log('🎖️ Assigning achievements...');

  await prisma.userAchievement.upsert({
    where: {
      userId_achievementId: {
        userId: player.id,
        achievementId: 'achievement-first-session',
      },
    },
    update: {},
    create: {
      userId: player.id,
      achievementId: 'achievement-first-session',
    },
  });

  await prisma.userAchievement.upsert({
    where: {
      userId_achievementId: {
        userId: master.id,
        achievementId: 'achievement-master-debut',
      },
    },
    update: {},
    create: {
      userId: master.id,
      achievementId: 'achievement-master-debut',
    },
  });

  // ===== REVIEW =====
  console.log('⭐ Creating review...');

  await prisma.review.upsert({
    where: {
      userId_sessionId: {
        userId: player.id,
        sessionId: sessionPresencial.id,
      },
    },
    update: {},
    create: {
      userId: player.id,
      sessionId: sessionPresencial.id,
      rating: 5,
      comment:
        'Sessão incrível! O Alex é um mestre fantástico e a Caverna do Dragão tem um ambiente perfeito para RPG. Mal posso esperar pela próxima aventura!',
    },
  });

  // ===== LEDGER ENTRIES =====
  console.log('💰 Creating ledger entries...');

  await prisma.ledgerEntry.upsert({
    where: { id: 'ledger-master-commission' },
    update: {},
    create: {
      id: 'ledger-master-commission',
      type: 'CREDIT',
      amount: 38.25, // 85% of 45.00
      currency: 'BRL',
      description: 'Comissão da sessão: A Maldição de Strahd - Capítulo 1',
      reference: 'session-strahd-presencial',
      userId: master.id,
    },
  });

  await prisma.ledgerEntry.upsert({
    where: { id: 'ledger-platform-commission' },
    update: {},
    create: {
      id: 'ledger-platform-commission',
      type: 'COMMISSION',
      amount: 6.75, // 15% of 45.00
      currency: 'BRL',
      description: 'Taxa da plataforma - sessão: A Maldição de Strahd',
      reference: 'session-strahd-presencial',
      userId: master.id, // Platform commission tracked against master
    },
  });

  console.log('✅ Database seed completed successfully!');

  // ===== SUMMARY =====
  console.log('\n📊 Seed Summary:');
  console.log('👥 Users: 3 (1 Master, 1 Player, 1 Store Owner)');
  console.log('🏪 Venues: 1 (Caverna do Dragão)');
  console.log('🪑 Tables: 2 (Mesa 1, Mesa 2)');
  console.log('🎲 Sessions: 2 (1 presencial, 1 online)');
  console.log('📝 Bookings: 1 (confirmado)');
  console.log('💬 Chat Messages: 3');
  console.log('🔔 Notifications: 2');
  console.log('🍕 Food Items: 3');
  console.log('🏆 Achievements: 3');
  console.log('⭐ Reviews: 1');
  console.log('💰 Ledger Entries: 2');
}

main()
  .catch(e => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
