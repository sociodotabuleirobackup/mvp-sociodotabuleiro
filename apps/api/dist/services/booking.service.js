"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BookingService = void 0;
const database_1 = require("@socio-do-tabuleiro/database");
class BookingService {
    constructor(bookingRepository, sessionService) {
        this.bookingRepository = bookingRepository;
        this.sessionService = sessionService;
    }
    async getUserBookings(userId) {
        return this.bookingRepository.findByUserId(userId);
    }
    async createBooking(userId, sessionId) {
        // Check if session exists and is available
        const session = await this.sessionService.getSessionById(sessionId);
        if (session.status !== database_1.SessionStatus.OPEN) {
            throw new Error('Session is not available for booking');
        }
        // Check if session is in the future
        if (session.scheduledAt <= new Date()) {
            throw new Error('Cannot book a session that has already started');
        }
        // Check if user already has a booking for this session
        const existingBooking = await this.bookingRepository.findByUserAndSession(userId, sessionId);
        if (existingBooking) {
            throw new Error('You already have a booking for this session');
        }
        // Check if session is full
        const confirmedBookings = await this.bookingRepository.countBySession(sessionId, database_1.BookingStatus.CONFIRMED);
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
    async confirmBooking(bookingId, userId) {
        const booking = await this.bookingRepository.findBookingById(bookingId);
        if (!booking) {
            throw new Error('Booking not found');
        }
        if (booking.userId !== userId) {
            throw new Error('Not authorized to confirm this booking');
        }
        if (booking.status !== database_1.BookingStatus.PENDING) {
            throw new Error('Booking is not in pending status');
        }
        // Check if session is still available
        const confirmedBookings = await this.bookingRepository.countBySession(booking.sessionId, database_1.BookingStatus.CONFIRMED);
        if (confirmedBookings >= booking.session.maxPlayers) {
            throw new Error('Session is now full');
        }
        return this.bookingRepository.updateStatus(bookingId, database_1.BookingStatus.CONFIRMED);
    }
    async cancelBooking(bookingId, userId) {
        const booking = await this.bookingRepository.findBookingById(bookingId);
        if (!booking) {
            throw new Error('Booking not found');
        }
        if (booking.userId !== userId) {
            throw new Error('Not authorized to cancel this booking');
        }
        if (booking.status === database_1.BookingStatus.CANCELLED) {
            throw new Error('Booking is already cancelled');
        }
        if (booking.status === database_1.BookingStatus.COMPLETED) {
            throw new Error('Cannot cancel a completed booking');
        }
        // Check if session has already started (allow cancellation up to 2 hours before)
        const twoHoursBefore = new Date(booking.session.scheduledAt.getTime() - 2 * 60 * 60 * 1000);
        if (new Date() > twoHoursBefore) {
            throw new Error('Cannot cancel booking less than 2 hours before session starts');
        }
        return this.bookingRepository.updateStatus(bookingId, database_1.BookingStatus.CANCELLED);
    }
}
exports.BookingService = BookingService;
