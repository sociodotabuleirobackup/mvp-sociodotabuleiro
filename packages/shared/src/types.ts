export type UserRole = 'PLAYER' | 'MASTER' | 'STORE' | 'ADMIN'
export type SessionStatus = 'OPEN' | 'FULL' | 'CANCELLED' | 'COMPLETED'
export type BookingStatus = 'PENDING' | 'CONFIRMED' | 'CANCELLED' | 'COMPLETED'

export interface ApiResponse<T = unknown> {
  success: boolean
  data?: T
  error?: string
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
}