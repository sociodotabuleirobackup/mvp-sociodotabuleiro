
/**
 * FIRESTORE DATA MODEL (MVP)
 * 
 * Estrutura completa para o Sócio do Tabuleiro.
 */

/*
collection: users
document: {uid}
{
  uid: string;
  email: string;
  displayName: string;
  role: 'MASTER' | 'PLAYER' | 'VENUE' | 'ADMIN';
  createdAt: timestamp;
  asaasCustomerId: string;
  walletBalance: number; 
  founderPactStatus: 'pending' | 'signed';
  profile: { bio: string; systems: string[]; ... }
}

collection: terms_acceptances
document: {uid}
{
  uid: string;
  acceptedVersion: string; // 'v1.0'
  acceptedAt: timestamp;
  ipAddress: string;
  device: string;
}

collection: contracts
document: {uid}
{
  uid: string;
  type: 'FOUNDER_PACT' | 'VENUE_AGREEMENT';
  status: 'PENDING' | 'SIGNED';
  zapSignDocId: string;
  signedUrl: string;
  createdAt: timestamp;
  updatedAt: timestamp;
}

collection: venues
document: {venueId}
{
  ownerId: string;
  name: string;
  address: string;
  coordinates: GeoPoint;
  tables: [ { id, name, capacity, pricePerHour } ];
  isOpen: boolean;
}

collection: food_menus
document: {venueId} (subcollection items)
  -> collection: items
     document: {itemId}
     { name, price, category, description }

collection: food_orders
document: {orderId}
{
  venueId: string;
  userId: string;
  items: [ { itemId, quantity, price } ];
  total: number;
  status: 'PENDING' | 'PREPARING' | 'READY' | 'DELIVERED';
  createdAt: timestamp;
}

collection: sessions
document: {sessionId}
{
  masterId: string;
  title: string;
  date: timestamp;
  price: number;
  status: 'DRAFT' | 'PUBLISHED' | 'COMPLETED' | 'CANCELED';
  currentPlayers: string[]; // [uid1, uid2]
  bookings: string[]; // [bookingId1, bookingId2]
}

collection: bookings
document: {bookingId}
{
  sessionId: string;
  playerId: string;
  status: 'PENDING_PAYMENT' | 'PAID' | 'CONFIRMED' | 'CANCELED';
  paymentId: string;
  amount: number;
  createdAt: timestamp;
}

collection: payments
document: {paymentId}
{
  bookingId?: string;
  orderId?: string; // Food order
  userId: string;
  externalId: string; // Asaas ID
  amount: number;
  status: 'PENDING' | 'CONFIRMED' | 'REFUNDED';
  splits: [ { walletId, percentage } ];
}

collection: chats
document: {chatId}
{
  sessionId?: string;
  participantIds: string[]; // [masterId, playerId...]
  lastMessage: string;
  updatedAt: timestamp;
}
  -> collection: messages
     document: {msgId}
     { senderId, text, timestamp }

collection: notifications
document: {uid}
  -> collection: items
     document: {notifId}
     { title, message, type, read: boolean, actionLink }

collection: marketplace_assets
document: {assetId}
{
  authorId: string;
  title: string;
  type: 'MAP' | 'PDF';
  price: number;
  fileUrl: string; // Protected URL
}

collection: adventure_purchases
document: {purchaseId}
{
  userId: string;
  assetId: string;
  paymentId: string;
  purchasedAt: timestamp;
}

collection: ledger
document: {transactionId}
{
  uid: string;
  amount: number;
  type: 'CREDIT' | 'DEBIT';
  origin: 'SESSION' | 'WITHDRAWAL';
  balanceAfter: number;
  createdAt: timestamp;
}
*/

export const COLLECTIONS = {
  USERS: 'users',
  TERMS: 'terms_acceptances',
  CONTRACTS: 'contracts',
  VENUES: 'venues',
  SESSIONS: 'sessions',
  BOOKINGS: 'bookings',
  PAYMENTS: 'payments',
  CHATS: 'chats',
  NOTIFICATIONS: 'notifications',
  ASSETS: 'marketplace_assets',
  PURCHASES: 'adventure_purchases',
  LEDGER: 'ledger',
  FOOD_ORDERS: 'food_orders'
};
