// ===== ENUMS (mirroring Prisma schema) =====

export enum UserRole {
  PLAYER = 'PLAYER',
  MASTER = 'MASTER',
  STORE = 'STORE',
  VENUE = 'STORE', // Maps to STORE for Prisma compatibility
  ADMIN = 'ADMIN',
}

export function isStoreRole(role: UserRole | string): boolean {
  const r = String(role).toUpperCase();
  return r === 'STORE' || r === 'VENUE';
}

export function normalizeUserRole(role: string): UserRole {
  const r = role.toUpperCase();
  if (r === 'VENUE') return UserRole.STORE;
  return r as UserRole;
}

export enum SessionStatus {
  // Prisma values (uppercase) - matching Prisma schema
  OPEN = 'OPEN',
  FULL = 'FULL',
  CANCELLED = 'CANCELLED',
  COMPLETED = 'COMPLETED',
  // Legacy aliases for backwards compatibility
  DRAFT = 'OPEN',
  PUBLISHED = 'OPEN',
}

export function isSessionActive(status: SessionStatus | string): boolean {
  const s = String(status).toLowerCase();
  return s === 'open' || s === 'published';
}

export function isSessionCompleted(status: SessionStatus | string): boolean {
  const s = String(status).toLowerCase();
  return s === 'completed';
}

export function isSessionCancelled(status: SessionStatus | string): boolean {
  const s = String(status).toLowerCase();
  return s === 'cancelled' || s === 'canceled';
}

export function normalizeSessionStatus(status: string): SessionStatus {
  const s = status.toLowerCase();
  if (s === 'open') return SessionStatus.OPEN;
  if (s === 'published') return SessionStatus.PUBLISHED;
  if (s === 'full') return SessionStatus.FULL;
  if (s === 'cancelled' || s === 'canceled') return SessionStatus.CANCELLED;
  if (s === 'completed') return SessionStatus.COMPLETED;
  if (s === 'draft') return SessionStatus.DRAFT;
  return status as SessionStatus;
}

export function toPrismaSessionStatus(status: SessionStatus | string): string {
  const s = String(status).toUpperCase();
  // Normalize to Prisma uppercase format
  if (s === 'OPEN' || s === 'PUBLISHED' || s === 'DRAFT') return 'OPEN';
  if (s === 'COMPLETED') return 'COMPLETED';
  if (s === 'CANCELLED' || s === 'CANCELED') return 'CANCELLED';
  if (s === 'FULL') return 'FULL';
  return s;
}

export function fromPrismaSessionStatus(status: string): SessionStatus {
  // Already in Prisma format, return as-is
  return status as SessionStatus;
}

export enum LocationType {
  ONLINE = 'ONLINE',
  VENUE = 'VENUE',
}

export enum BookingStatus {
  // Prisma values (uppercase) - matching Prisma schema
  PENDING = 'PENDING',
  CONFIRMED = 'CONFIRMED',
  CANCELLED = 'CANCELLED',
  COMPLETED = 'COMPLETED',
  REFUNDED = 'REFUNDED',
  // Legacy alias
  PENDING_PAYMENT = 'PENDING',
}

export enum PaymentStatus {
  PENDING = 'PENDING',
  PROCESSING = 'PROCESSING',
  COMPLETED = 'COMPLETED',
  FAILED = 'FAILED',
  REFUNDED = 'REFUNDED',
}

export enum PaymentMethod {
  PIX = 'PIX',
  CREDIT_CARD = 'CREDIT_CARD',
  DEBIT_CARD = 'DEBIT_CARD',
  BANK_TRANSFER = 'BANK_TRANSFER',
}

export enum SubscriptionType {
  MASTER_BASIC = 'MASTER_BASIC',
  MASTER_PRO = 'MASTER_PRO',
  STORE_BASIC = 'STORE_BASIC',
  STORE_PRO = 'STORE_PRO',
}

export enum SubscriptionStatus {
  ACTIVE = 'ACTIVE',
  CANCELLED = 'CANCELLED',
  EXPIRED = 'EXPIRED',
  SUSPENDED = 'SUSPENDED',
}

export enum ChatType {
  SESSION = 'SESSION',
  DIRECT = 'DIRECT',
  GROUP = 'GROUP',
}

export enum MessageType {
  TEXT = 'TEXT',
  IMAGE = 'IMAGE',
  FILE = 'FILE',
  SYSTEM = 'SYSTEM',
}

export enum NotificationType {
  BOOKING_CONFIRMED = 'BOOKING_CONFIRMED',
  BOOKING_CANCELLED = 'BOOKING_CANCELLED',
  SESSION_REMINDER = 'SESSION_REMINDER',
  PAYMENT_RECEIVED = 'PAYMENT_RECEIVED',
  CHAT_MESSAGE = 'CHAT_MESSAGE',
  SYSTEM = 'SYSTEM',
}

export enum FoodCategory {
  APPETIZER = 'APPETIZER',
  MAIN_COURSE = 'MAIN_COURSE',
  DESSERT = 'DESSERT',
  BEVERAGE = 'BEVERAGE',
  SNACK = 'SNACK',
}

export enum FoodOrderStatus {
  PENDING = 'PENDING',
  PREPARING = 'PREPARING',
  READY = 'READY',
  DELIVERED = 'DELIVERED',
  CANCELLED = 'CANCELLED',
}

export enum LedgerType {
  CREDIT = 'CREDIT',
  DEBIT = 'DEBIT',
  COMMISSION = 'COMMISSION',
  REFUND = 'REFUND',
  WITHDRAWAL = 'WITHDRAWAL',
}

export enum StripeVerificationStatus {
  PENDING = 'PENDING',
  PROCESSING = 'PROCESSING',
  VERIFIED = 'VERIFIED',
  FAILED = 'FAILED',
  REQUIRES_ACTION = 'REQUIRES_ACTION',
}

export enum ContractStatus {
  DRAFT = 'DRAFT',
  PENDING_SIGNATURE = 'PENDING_SIGNATURE',
  SIGNED = 'SIGNED',
  CANCELED = 'CANCELED',
}

// Legacy alias for OrderStatus
export const OrderStatus = FoodOrderStatus;

// ===== MODELS (mirroring Prisma schema) =====

export interface User {
  id: string;
  email: string;
  name?: string;
  avatar?: string;
  role: UserRole;
  phone?: string;
  cpf?: string;
  createdAt: string;
  updatedAt: string;
  stripeCustomerId?: string;
  stripeConnectAccountId?: string;
  stripeVerificationStatus: StripeVerificationStatus;
  stripeVerifiedAt?: string;
  // Legacy fields for backwards compatibility
  uid?: string;
  avatarUrl?: string;
  level?: number;
  asaasCustomerId?: string;
  walletBalance?: number;
  founderPactStatus?: ContractStatus;
  termsAcceptedAt?: string;
}

export interface MasterProfile {
  id: string;
  userId: string;
  bio?: string;
  experience: number;
  rating: number;
  totalGames: number;
  specialties: string[];
  user?: User;
}

export interface StoreProfile {
  id: string;
  userId: string;
  storeName: string;
  cnpj?: string;
  address?: string;
  phone?: string;
  latitude?: number;
  longitude?: number;
  user?: User;
}

export interface Venue {
  id: string;
  name: string;
  description?: string;
  address: string;
  latitude?: number;
  longitude?: number;
  capacity: number;
  amenities: string[];
  storeId: string;
  createdAt: string;
  updatedAt: string;
  store?: StoreProfile;
  tables?: Table[];
}

export interface Table {
  id: string;
  number: string;
  capacity: number;
  isActive: boolean;
  venueId: string;
  createdAt: string;
  updatedAt: string;
  venue?: Venue;
}

export interface Session {
  id: string;
  title: string;
  description?: string;
  gameSystem: string;
  maxPlayers: number;
  price: number;
  duration: number;
  status: SessionStatus;
  locationType: LocationType;
  scheduledAt: string;
  createdAt: string;
  updatedAt: string;
  masterId?: string;
  master?: MasterProfile;
  storeId?: string;
  store?: StoreProfile;
  venueId?: string;
  venue?: Venue;
  tableId?: string;
  table?: Table;
  // Computed fields for UI
  playersCurrent?: number;
  playersMax?: number;
  imageUrl?: string;
  tags?: string[];
  masterName?: string;
  masterAvatar?: string;
  venueName?: string;
  venueAddress?: string;
  // Legacy fields
  system?: string;
  date?: string;
  googleCalendarEventId?: string;
}

export interface Booking {
  id: string;
  status: BookingStatus;
  paymentId?: string;
  amount?: number;
  createdAt: string;
  updatedAt: string;
  userId: string;
  sessionId: string;
  user?: User;
  session?: Session;
  payments?: Payment[];
  // Legacy fields
  playerId?: string;
}

export interface Payment {
  id: string;
  amount: number;
  currency: string;
  status: PaymentStatus;
  method: PaymentMethod;
  externalId?: string;
  description?: string;
  bookingId?: string;
  subscriptionId?: string;
  createdAt: string;
  updatedAt: string;
  booking?: Booking;
  subscription?: Subscription;
}

export interface Subscription {
  id: string;
  type: SubscriptionType;
  status: SubscriptionStatus;
  price: number;
  currency: string;
  interval: string;
  userId: string;
  startsAt: string;
  endsAt?: string;
  createdAt: string;
  updatedAt: string;
  user?: User;
  payments?: Payment[];
}

export interface Chat {
  id: string;
  type: ChatType;
  name?: string;
  sessionId?: string;
  createdAt: string;
  updatedAt: string;
  session?: Session;
  messages?: ChatMessage[];
}

export interface ChatMessage {
  id: string;
  content: string;
  type: MessageType;
  userId: string;
  chatId: string;
  createdAt: string;
  user?: User;
  chat?: Chat;
  // Legacy fields
  senderId?: string;
  text?: string;
  timestamp?: string;
}

export interface ChatThread {
  id: string;
  participantName: string;
  participantAvatar: string;
  lastMessage: string;
  lastMessageTime: string;
  unreadCount: number;
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: NotificationType;
  isRead: boolean;
  data?: Record<string, unknown>;
  userId: string;
  createdAt: string;
  user?: User;
  // Legacy fields
  read?: boolean;
  date?: string;
  actionLink?: string;
}

export interface Adventure {
  id: string;
  title: string;
  description: string;
  gameSystem: string;
  price: number;
  imageUrl?: string;
  fileUrl?: string;
  tags: string[];
  rating: number;
  downloads: number;
  authorId: string;
  createdAt: string;
  updatedAt: string;
  author?: User;
}

export interface Purchase {
  id: string;
  amount: number;
  userId: string;
  adventureId: string;
  createdAt: string;
  user?: User;
  adventure?: Adventure;
}

export interface FoodMenu {
  id: string;
  name: string;
  isActive: boolean;
  storeId: string;
  createdAt: string;
  updatedAt: string;
  store?: StoreProfile;
  items?: FoodItem[];
}

export interface FoodItem {
  id: string;
  name: string;
  description?: string;
  price: number;
  category: FoodCategory;
  imageUrl?: string;
  isAvailable: boolean;
  menuId: string;
  createdAt: string;
  updatedAt: string;
  menu?: FoodMenu;
  // Legacy fields
  venueId?: string;
}

export interface FoodOrder {
  id: string;
  status: FoodOrderStatus;
  total: number;
  notes?: string;
  userId: string;
  createdAt: string;
  updatedAt: string;
  user?: User;
  items?: FoodOrderItem[];
  // Legacy fields
  venueId?: string;
  tableId?: string;
}

export interface FoodOrderItem {
  id: string;
  quantity: number;
  price: number;
  orderId: string;
  itemId: string;
  order?: FoodOrder;
  item?: FoodItem;
  // Legacy fields
  name?: string;
}

export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon?: string;
  points: number;
  createdAt: string;
}

export interface UserAchievement {
  id: string;
  userId: string;
  achievementId: string;
  unlockedAt: string;
  user?: User;
  achievement?: Achievement;
}

export interface LedgerEntry {
  id: string;
  type: LedgerType;
  amount: number;
  currency: string;
  description: string;
  reference?: string;
  userId: string;
  createdAt: string;
  user?: User;
}

export interface Review {
  id: string;
  rating: number;
  comment?: string;
  userId: string;
  sessionId: string;
  createdAt: string;
  user?: User;
  session?: Session;
}

export interface GeoCoordinates {
  lat: number;
  lng: number;
}

// Legacy type alias for backwards compatibility
export interface Asset {
  id: string;
  title: string;
  type: 'MAP' | 'TOKEN' | 'MODULE';
  price: number;
  author: string;
  imageUrl: string;
  rating: number;
  downloadUrl?: string;
}

// ===== API Response Types =====

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  hasMore: boolean;
}

// ===== Stripe Connect Types =====

export interface StripeConnectAccount {
  accountId: string;
  status: StripeVerificationStatus;
  chargesEnabled: boolean;
  payoutsEnabled: boolean;
  detailsSubmitted: boolean;
  requirements?: {
    currentlyDue: string[];
    eventuallyDue: string[];
    pastDue: string[];
  };
}

export interface SplitPaymentConfig {
  transactionType: 'table_reservation' | 'rpg_session' | 'food_order';
  platformFeePercent: number;
  destinationPercent: number;
}
