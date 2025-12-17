/* scripts/seed-firestore.ts */
import { FieldValue, Timestamp, GeoPoint } from "firebase-admin/firestore";
import { adminDb } from "./firebase-admin"; // Importa a instância configurada
import * as dotenv from 'dotenv';

dotenv.config();

// Usa o DB já inicializado
const db = adminDb;
const projectId = process.env.VITE_FIREBASE_PROJECT_ID;

// Segurança: validação de ambiente
const isEmulator = !!process.env.FIRESTORE_EMULATOR_HOST;
const allowProd = process.env.SEED_ALLOW_PROD === "YES";

if (!isEmulator && !allowProd) {
  console.warn("⚠️  ATENÇÃO: Você está prestes a rodar o seed no projeto REAL:", projectId);
  console.warn("Para confirmar, defina SEED_ALLOW_PROD=YES no .env.");
  // Em scripts Node, usamos process.exit
  (process as any).exit(1);
}

const now = () => FieldValue.serverTimestamp();

async function main() {
  console.log(`🌱 Seeding Firestore | Project: ${projectId} | Emulator: ${isEmulator}`);

  // UIDs fake (em DEV) para facilitar login.
  const masterUid = "seed_master_001";
  const playerUid = "seed_player_001";
  const venueOwnerUid = "seed_venue_001";
  const venueId = "seed_venue_place_001";
  const sessionId = "session_001";

  const batch = db.batch();

  // ---------------------------------------------------------
  // 1. USERS
  // ---------------------------------------------------------
  console.log("... Criando Usuários");

  const users = [
    {
      uid: masterUid,
      data: {
        name: "Mestre Supremo",
        email: "mestre@teste.com",
        role: "MASTER",
        createdAt: now(),
        avatarUrl: "https://picsum.photos/seed/master/200",
        founderPactStatus: "SIGNED",
        walletBalance: 150.00,
        profile: {
            bio: "Narrando pesadelos desde 1990.",
            systems: ["D&D 5e", "Call of Cthulhu"],
            experienceYears: 15
        }
      }
    },
    {
      uid: playerUid,
      data: {
        name: "Jogador Aventureiro",
        email: "jogador@teste.com",
        role: "PLAYER",
        createdAt: now(),
        avatarUrl: "https://picsum.photos/seed/player/200",
        walletBalance: 0.00,
        profile: {
            genres: ["Fantasia", "Terror"]
        }
      }
    },
    {
      uid: venueOwnerUid,
      data: {
        name: "Dono da Taverna",
        email: "loja@teste.com",
        role: "VENUE",
        createdAt: now(),
        avatarUrl: "https://picsum.photos/seed/venue/200",
        founderPactStatus: "SIGNED"
      }
    }
  ];

  for (const u of users) {
    const ref = db.collection('users').doc(u.uid);
    batch.set(ref, u.data);
  }

  // ---------------------------------------------------------
  // 2. VENUE (LOJA)
  // ---------------------------------------------------------
  console.log("... Criando Loja e Mesas");
  
  const venueRef = db.collection('venues').doc(venueId);
  batch.set(venueRef, {
    ownerId: venueOwnerUid,
    name: "Caverna do Dragão",
    address: "Av. Paulista, 1000 - São Paulo, SP",
    description: "O melhor lugar para jogar RPG em SP. Temos lanches e ar condicionado.",
    coordinates: new GeoPoint(-23.561684, -46.655981), // Mock Coordinates
    isOpen: true,
    amenities: ["Wi-Fi", "Ar Condicionado", "Lanchonete", "Estacionamento"]
  });

  // Subcoleção de Mesas da Loja
  const tableRef = venueRef.collection('tables').doc('table_001');
  batch.set(tableRef, {
    name: "Mesa VIP (Masmorra)",
    capacity: 6,
    pricePerHour: 20.00,
    isReserved: false
  });

  // ---------------------------------------------------------
  // 3. SESSION (MESA DE RPG)
  // ---------------------------------------------------------
  console.log("... Criando Sessão");

  const sessionRef = db.collection('sessions').doc(sessionId);
  // Data futura (daqui a 3 dias)
  const sessionDate = new Date();
  sessionDate.setDate(sessionDate.getDate() + 3);
  sessionDate.setHours(19, 0, 0, 0);

  batch.set(sessionRef, {
    masterId: masterUid,
    masterName: "Mestre Supremo",
    masterAvatar: "https://picsum.photos/seed/master/200",
    title: "A Maldição de Strahd",
    system: "D&D 5e",
    description: "Uma aventura gótica nas terras de Barovia. Traga sua coragem (e fichas nível 3).",
    date: Timestamp.fromDate(sessionDate),
    price: 35.00,
    playersCurrent: 1,
    playersMax: 5,
    imageUrl: "https://picsum.photos/seed/strahd/800/400",
    tags: ["Horror", "D&D", "Roleplay"],
    status: "PUBLISHED",
    locationType: "VENUE",
    venueId: venueId,
    venueName: "Caverna do Dragão",
    venueAddress: "Av. Paulista, 1000 - São Paulo, SP",
    currentPlayers: [playerUid]
  });

  // ---------------------------------------------------------
  // 4. BOOKING & CHAT
  // ---------------------------------------------------------
  console.log("... Criando Booking e Chat Inicial");

  const bookingRef = db.collection('bookings').doc('booking_001');
  batch.set(bookingRef, {
    sessionId: sessionId,
    playerId: playerUid,
    status: 'CONFIRMED',
    paymentId: 'pay_mock_123',
    createdAt: now()
  });

  const chatRef = db.collection('chats').doc(`chat_${sessionId}`);
  batch.set(chatRef, {
      sessionId: sessionId,
      participantIds: [masterUid, playerUid],
      lastMessage: "Sejam bem-vindos à Barovia!",
      updatedAt: now()
  });

  // ---------------------------------------------------------
  // 5. MARKETPLACE
  // ---------------------------------------------------------
  console.log("... Criando Itens do Marketplace");

  const assetRef = db.collection('marketplace_assets').doc('asset_001');
  batch.set(assetRef, {
    authorId: masterUid,
    title: "Mapa: Masmorra Sombria",
    type: "MAP",
    price: 15.00,
    imageUrl: "https://picsum.photos/seed/map1/300",
    rating: 4.8,
    description: "Mapa em alta resolução 4k gridless."
  });

  // Commit da transação em lote
  await batch.commit();
  console.log("✅ Seed concluído com sucesso!");
}

main().catch(console.error);