"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.bookingRoutes = bookingRoutes;
const booking_repository_1 = require("../repositories/booking.repository");
const session_repository_1 = require("../repositories/session.repository");
const user_repository_1 = require("../repositories/user.repository");
const booking_service_1 = require("../services/booking.service");
const session_service_1 = require("../services/session.service");
const user_service_1 = require("../services/user.service");
const booking_schemas_1 = require("../schemas/booking.schemas");
const auth_middleware_1 = require("../middleware/auth.middleware");
async function bookingRoutes(app) {
    const bookingRepository = new booking_repository_1.BookingRepository(app.prisma);
    const sessionRepository = new session_repository_1.SessionRepository(app.prisma);
    const userRepository = new user_repository_1.UserRepository(app.prisma);
    const userService = new user_service_1.UserService(userRepository);
    const sessionService = new session_service_1.SessionService(sessionRepository, userService);
    const bookingService = new booking_service_1.BookingService(bookingRepository, sessionService);
    // GET /api/bookings/my - Get user's bookings
    app.get('/bookings/my', {
        preHandler: [auth_middleware_1.requireAnyRole],
    }, async (request, reply) => {
        try {
            const bookings = await bookingService.getUserBookings(request.user.id);
            return {
                success: true,
                data: bookings,
                count: bookings.length,
            };
        }
        catch (error) {
            app.log.error({ error, userId: request.user.id }, 'Failed to fetch user bookings');
            return reply.status(500).send({
                success: false,
                error: 'Internal server error',
            });
        }
    });
    // POST /api/bookings - Create booking
    app.post('/bookings', {
        preHandler: [auth_middleware_1.requireAnyRole],
    }, async (request, reply) => {
        try {
            const { sessionId } = booking_schemas_1.createBookingSchema.parse(request.body);
            const booking = await bookingService.createBooking(request.user.id, sessionId);
            app.log.info({
                bookingId: booking.id,
                userId: request.user.id,
                sessionId,
            }, 'Booking created');
            return reply.status(201).send({
                success: true,
                data: booking,
            });
        }
        catch (error) {
            if (error instanceof Error && error.name === 'ZodError') {
                return reply.status(400).send({
                    success: false,
                    error: 'Validation failed',
                    details: error.issues,
                });
            }
            if (error instanceof Error) {
                const businessErrors = [
                    'Session not found',
                    'Session is not available for booking',
                    'Cannot book a session that has already started',
                    'You already have a booking for this session',
                    'Session is full',
                    'Masters cannot book their own sessions',
                ];
                if (businessErrors.includes(error.message)) {
                    const statusCode = error.message === 'Session not found' ? 404 : 400;
                    return reply.status(statusCode).send({
                        success: false,
                        error: error.message,
                    });
                }
            }
            app.log.error({
                error,
                userId: request.user.id,
                sessionId: request.body?.sessionId,
            }, 'Failed to create booking');
            return reply.status(500).send({
                success: false,
                error: 'Internal server error',
            });
        }
    });
    // PUT /api/bookings/:id/confirm - Confirm booking (simulate payment)
    app.put('/bookings/:id/confirm', {
        preHandler: [auth_middleware_1.requireAnyRole],
    }, async (request, reply) => {
        try {
            const { id } = request.params;
            const booking = await bookingService.confirmBooking(id, request.user.id);
            app.log.info({
                bookingId: id,
                userId: request.user.id,
            }, 'Booking confirmed');
            return {
                success: true,
                data: booking,
            };
        }
        catch (error) {
            if (error instanceof Error) {
                if (error.message === 'Booking not found') {
                    return reply.status(404).send({
                        success: false,
                        error: error.message,
                    });
                }
                const businessErrors = [
                    'Not authorized to confirm this booking',
                    'Booking is not in pending status',
                    'Session is now full',
                ];
                if (businessErrors.includes(error.message)) {
                    return reply.status(400).send({
                        success: false,
                        error: error.message,
                    });
                }
            }
            app.log.error({
                error,
                bookingId: request.params.id,
                userId: request.user.id,
            }, 'Failed to confirm booking');
            return reply.status(500).send({
                success: false,
                error: 'Internal server error',
            });
        }
    });
    // DELETE /api/bookings/:id - Cancel booking
    app.delete('/bookings/:id', {
        preHandler: [auth_middleware_1.requireAnyRole],
    }, async (request, reply) => {
        try {
            const { id } = request.params;
            const booking = await bookingService.cancelBooking(id, request.user.id);
            app.log.info({
                bookingId: id,
                userId: request.user.id,
            }, 'Booking cancelled');
            return {
                success: true,
                data: booking,
            };
        }
        catch (error) {
            if (error instanceof Error) {
                if (error.message === 'Booking not found') {
                    return reply.status(404).send({
                        success: false,
                        error: error.message,
                    });
                }
                const businessErrors = [
                    'Not authorized to cancel this booking',
                    'Booking is already cancelled',
                    'Cannot cancel a completed booking',
                    'Cannot cancel booking less than 2 hours before session starts',
                ];
                if (businessErrors.includes(error.message)) {
                    return reply.status(400).send({
                        success: false,
                        error: error.message,
                    });
                }
            }
            app.log.error({
                error,
                bookingId: request.params.id,
                userId: request.user.id,
            }, 'Failed to cancel booking');
            return reply.status(500).send({
                success: false,
                error: 'Internal server error',
            });
        }
    });
}
