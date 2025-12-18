import { BookingRepository } from '../repositories/booking.repository';
import { SessionService } from './session.service';
import { BookingStatus, SessionStatus } from '@socio-do-tabuleiro/database';

export class BookingService {
  constructor(
    private bookingRepository: BookingRepository,
    private sessionService: SessionService
  ) {}

  async getUserBookings(userId: string) {
    return this.bookingRepository.findByUserId(userId);
  }

  async createBooking(userId: string, sessionId: string) {
    // Check if session exists and is available
    const session = await this.sessionService.getSessionById(sessionId);

    if (session.status !== SessionStatus.OPEN) {
      throw new Error('Session is not available for booking');
    }

    // Check if session is in the future
    if (session.scheduledAt <= new Date()) {
      throw new Error('Cannot book a session that has already started');
    }

    // Check if user already has a booking for this session
    const existingBooking = await this.bookingRepository.findByUserAndSession(
      userId,
      sessionId
    );
    if (existingBooking) {
      throw new Error('You already have a booking for this session');
    }

    // Check if session is full
    const confirmedBookings = await this.bookingRepository.countBySession(
      sessionId,
      BookingStatus.CONFIRMED
    );

    if (confirmedBookings >= session.maxPlayers) {
      throw new Error('Session is full');
    }

    // Check if user is the master of the session
    const user = await this.bookingRepository.findUserById(userId);

    if (user?.masterProfile?.id === session.masterId) {
      throw new Error('Masters cannot book their own sessions');
    }

    return this.bookingRepository.create({
      userId,
      sessionId,
      amount: session.price,
    });
  }

  async confirmBooking(bookingId: string, userId: string) {
    const booking = await this.bookingRepository.findBookingById(bookingId);

    if (!booking) {
      throw new Error('Booking not found');
    }

    if (booking.userId !== userId) {
      throw new Error('Not authorized to confirm this booking');
    }

    if (booking.status !== BookingStatus.PENDING) {
      throw new Error('Booking is not in pending status');
    }

    // Check if session is still available
    const confirmedBookings = await this.bookingRepository.countBySession(
      booking.sessionId,
      BookingStatus.CONFIRMED
    );

    if (confirmedBookings >= booking.session.maxPlayers) {
      throw new Error('Session is now full');
    }

    return this.bookingRepository.updateStatus(
      bookingId,
      BookingStatus.CONFIRMED
    );
  }

  async cancelBooking(bookingId: string, userId: string) {
    const booking = await this.bookingRepository.findBookingById(bookingId);

    if (!booking) {
      throw new Error('Booking not found');
    }

    if (booking.userId !== userId) {
      throw new Error('Not authorized to cancel this booking');
    }

    if (booking.status === BookingStatus.CANCELLED) {
      throw new Error('Booking is already cancelled');
    }

    if (booking.status === BookingStatus.COMPLETED) {
      throw new Error('Cannot cancel a completed booking');
    }

    // Check if session has already started (allow cancellation up to 2 hours before)
    const twoHoursBefore = new Date(
      booking.session.scheduledAt.getTime() - 2 * 60 * 60 * 1000
    );
    if (new Date() > twoHoursBefore) {
      throw new Error(
        'Cannot cancel booking less than 2 hours before session starts'
      );
    }

    return this.bookingRepository.updateStatus(
      bookingId,
      BookingStatus.CANCELLED
    );
  }
}
