import { SessionRepository, SessionFilters } from '../repositories/session.repository'
import { UserService } from './user.service'
import { SessionStatus, LocationType } from '@socio-do-tabuleiro/database'

export class SessionService {
  constructor(
    private sessionRepository: SessionRepository,
    private userService: UserService
  ) {}

  async getSessions(filters: SessionFilters = {}) {
    // Default to only show open sessions
    if (!filters.status) {
      filters.status = SessionStatus.OPEN
    }

    return this.sessionRepository.findMany(filters)
  }

  async getSessionById(id: string) {
    const session = await this.sessionRepository.findById(id)
    if (!session) {
      throw new Error('Session not found')
    }
    return session
  }

  async createSession(masterId: string, data: {
    title: string
    description?: string
    gameSystem: string
    maxPlayers: number
    price: number
    duration: number
    scheduledAt: Date
    locationType: LocationType
    storeId?: string
    venueId?: string
    tableId?: string
  }) {
    // Verify user can create sessions
    const canCreate = await this.userService.canCreateSession(masterId)
    if (!canCreate) {
      throw new Error('User is not authorized to create sessions')
    }

    // Get master profile ID
    const user = await this.userService.getOrCreateUser({ id: masterId, email: '' })
    if (!user.masterProfile) {
      throw new Error('Master profile not found')
    }

    // Validate scheduling
    if (data.scheduledAt <= new Date()) {
      throw new Error('Session must be scheduled in the future')
    }

    // Validate duration
    if (data.duration < 30 || data.duration > 720) {
      throw new Error('Session duration must be between 30 minutes and 12 hours')
    }

    // Validate max players
    if (data.maxPlayers < 1 || data.maxPlayers > 20) {
      throw new Error('Max players must be between 1 and 20')
    }

    // Validate price
    if (data.price < 0) {
      throw new Error('Price cannot be negative')
    }

    return this.sessionRepository.create({
      ...data,
      masterId: user.masterProfile.id
    })
  }

  async updateSession(sessionId: string, masterId: string, data: Partial<{
    title: string
    description: string
    gameSystem: string
    maxPlayers: number
    price: number
    duration: number
    scheduledAt: Date
  }>) {
    const session = await this.getSessionById(sessionId)
    
    // Verify ownership
    const user = await this.userService.getOrCreateUser({ id: masterId, email: '' })
    if (session.masterId !== user.masterProfile?.id) {
      throw new Error('Not authorized to update this session')
    }

    // Validate if session can be updated
    if (session.status !== SessionStatus.OPEN) {
      throw new Error('Cannot update a session that is not open')
    }

    // Validate scheduling if provided
    if (data.scheduledAt && data.scheduledAt <= new Date()) {
      throw new Error('Session must be scheduled in the future')
    }

    return this.sessionRepository.update(sessionId, data)
  }

  async cancelSession(sessionId: string, masterId: string) {
    const session = await this.getSessionById(sessionId)
    
    // Verify ownership
    const user = await this.userService.getOrCreateUser({ id: masterId, email: '' })
    if (session.masterId !== user.masterProfile?.id) {
      throw new Error('Not authorized to cancel this session')
    }

    // Check if session can be cancelled
    if (session.status === SessionStatus.CANCELLED) {
      throw new Error('Session is already cancelled')
    }

    if (session.status === SessionStatus.COMPLETED) {
      throw new Error('Cannot cancel a completed session')
    }

    return this.sessionRepository.delete(sessionId)
  }
}