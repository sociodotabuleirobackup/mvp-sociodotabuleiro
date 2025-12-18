import { FastifyInstance } from 'fastify';
import { BookingRepository } from '../repositories/booking.repository';
import { SessionRepository } from '../repositories/session.repository';
import { UserRepository } from '../repositories/user.repository';
import { BookingService } from '../services/booking.service';
import { SessionService } from '../services/session.service';
import { UserService } from '../services/user.service';
import { createBookingSchema } from '../schemas/booking.schemas';
import { requireAnyRole } from '../middleware/auth.middleware';

export async function bookingRoutes(app: FastifyInstance) {
  const bookingRepository = new BookingRepository(app.prisma);
  const sessionRepository = new SessionRepository(app.prisma);
  const userRepository = new UserRepository(app.prisma);

  const userService = new UserService(userRepository);
  const sessionService = new SessionService(sessionRepository, userService);
  const bookingService = new BookingService(bookingRepository, sessionService);

  // GET /api/bookings/my - Get user's bookings
  app.get(
    '/bookings/my',
    {
      preHandler: [requireAnyRole],
    },
    async (request, reply) => {
      try {
        const bookings = await bookingService.getUserBookings(request.user.id);

        return {
          success: true,
          data: bookings,
          count: bookings.length,
        };
      } catch (error) {
        app.log.error(
          { error, userId: request.user.id },
          'Failed to fetch user bookings'
        );
        return reply.status(500).send({
          success: false,
          error: 'Internal server error',
        });
      }
    }
  );

  // POST /api/bookings - Create booking
  app.post(
    '/bookings',
    {
      preHandler: [requireAnyRole],
    },
    async (request, reply) => {
      try {
        const { sessionId } = createBookingSchema.parse(request.body);

        const booking = await bookingService.createBooking(
          request.user.id,
          sessionId
        );

        app.log.info(
          {
            bookingId: booking.id,
            userId: request.user.id,
            sessionId,
          },
          'Booking created'
        );

        return reply.status(201).send({
          success: true,
          data: booking,
        });
      } catch (error) {
        if (error instanceof Error && error.name === 'ZodError') {
          return reply.status(400).send({
            success: false,
            error: 'Validation failed',
            details: (error as any).issues,
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
            const statusCode =
              error.message === 'Session not found' ? 404 : 400;
            return reply.status(statusCode).send({
              success: false,
              error: error.message,
            });
          }
        }

        app.log.error(
          {
            error,
            userId: request.user.id,
            sessionId: (request.body as any)?.sessionId,
          },
          'Failed to create booking'
        );

        return reply.status(500).send({
          success: false,
          error: 'Internal server error',
        });
      }
    }
  );

  // PUT /api/bookings/:id/confirm - Confirm booking (simulate payment)
  app.put(
    '/bookings/:id/confirm',
    {
      preHandler: [requireAnyRole],
    },
    async (request, reply) => {
      try {
        const { id } = request.params as { id: string };

        const booking = await bookingService.confirmBooking(
          id,
          request.user.id
        );

        app.log.info(
          {
            bookingId: id,
            userId: request.user.id,
          },
          'Booking confirmed'
        );

        return {
          success: true,
          data: booking,
        };
      } catch (error) {
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

        app.log.error(
          {
            error,
            bookingId: (request.params as any).id,
            userId: request.user.id,
          },
          'Failed to confirm booking'
        );

        return reply.status(500).send({
          success: false,
          error: 'Internal server error',
        });
      }
    }
  );

  // DELETE /api/bookings/:id - Cancel booking
  app.delete(
    '/bookings/:id',
    {
      preHandler: [requireAnyRole],
    },
    async (request, reply) => {
      try {
        const { id } = request.params as { id: string };

        const booking = await bookingService.cancelBooking(id, request.user.id);

        app.log.info(
          {
            bookingId: id,
            userId: request.user.id,
          },
          'Booking cancelled'
        );

        return {
          success: true,
          data: booking,
        };
      } catch (error) {
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

        app.log.error(
          {
            error,
            bookingId: (request.params as any).id,
            userId: request.user.id,
          },
          'Failed to cancel booking'
        );

        return reply.status(500).send({
          success: false,
          error: 'Internal server error',
        });
      }
    }
  );
}
