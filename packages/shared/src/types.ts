export enum UserRole {
  GUEST = 'GUEST',
  MASTER = 'MASTER',
  PLAYER = 'PLAYER',
  VENUE = 'VENUE',
  ADMIN = 'ADMIN',
}

export enum SessionStatus {
  DRAFT = 'draft',
  PUBLISHED = 'published',
  COMPLETED = 'completed',
  CANCELED = 'canceled',
}

export enum PaymentStatus {
  PENDING = 'PENDING',
  RECEIVED = 'RECEIVED',
  CONFIRMED = 'CONFIRMED',
  OVERDUE = 'OVERDUE',
  REFUNDED = 'REFUNDED',
}

export enum ContractStatus {
  DRAFT = 'draft',
  PENDING_SIGNATURE = 'pending_signature',
  SIGNED = 'signed',
  CANCELED = 'canceled',
}

export enum BookingStatus {
  PENDING_PAYMENT = 'PENDING_PAYMENT',
  PAID = 'PAID',
  CONFIRMED = 'CONFIRMED',
  CANCELED = 'CANCELED',
  REFUNDED = 'REFUNDED',
}

export enum OrderStatus {
  PENDING = 'PENDING',
  PREPARING = 'PREPARING',
  READY = 'READY',
  DELIVERED = 'DELIVERED',
  CANCELED = 'CANCELED',
}

// --- Models ---

export interface User {
  uid: string;
  name: string;
  email: string;
  role: UserRole;
  avatarUrl?: string;
  level?: number;
  asaasCustomerId?: string;
  walletBalance?: number;
  founderPactStatus?: ContractStatus;
  termsAcceptedAt?: string;
}

export interface Session {
  id: string;
  title: string;
  system: string;
  description?: string;
  masterId: string;
  masterName: string;
  masterAvatar?: string;
  date: string;
  price: number;
  playersCurrent: number;
  playersMax: number;
  imageUrl: string;
  tags: string[];
  status: SessionStatus;
  locationType: 'ONLINE' | 'VENUE';
  venueName?: string;
  venueAddress?: string;
  googleCalendarEventId?: string;
}

export interface Booking {
  id: string;
  sessionId: string;
  playerId: string;
  status: BookingStatus;
  paymentId?: string;
  createdAt: string;
  amount?: number;
  // Populated by API when fetching bookings
  session?: {
    id: string;
    title: string;
    scheduledAt: string;
    imageUrl?: string;
    masterName?: string;
    master?: {
      user: {
        name: string;
      };
    };
    venue?: {
      name: string;
    };
  };
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'BOOKING' | 'PAYMENT' | 'SYSTEM' | 'CHAT' | 'CONTRACT';
  read: boolean;
  date: string;
  actionLink?: string;
}

export interface ChatMessage {
  id: string;
  senderId: string;
  text: string;
  timestamp: string;
}

export interface ChatThread {
  id: string;
  participantName: string;
  participantAvatar: string;
  lastMessage: string;
  lastMessageTime: string;
  unreadCount: number;
}

// --- Marketplace & Food ---

export interface Asset {
  id: string;
  title: string;
  type: 'MAP' | 'TOKEN' | 'MODULE';
  price: number;
  author: string;
  imageUrl: string;
  rating: number;
  downloadUrl?: string; // Only available if purchased
}

export interface FoodItem {
  id: string;
  venueId: string;
  name: string;
  description: string;
  price: number;
  imageUrl?: string;
  category: 'FOOD' | 'DRINK';
}

export interface FoodOrder {
  id: string;
  venueId: string;
  tableId?: string;
  items: { itemId: string; quantity: number; name: string }[];
  total: number;
  status: OrderStatus;
}

export interface GeoCoordinates {
  lat: number;
  lng: number;
}
