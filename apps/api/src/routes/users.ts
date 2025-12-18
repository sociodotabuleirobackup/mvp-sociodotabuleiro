import { FastifyInstance } from 'fastify';
import { UserRepository } from '../repositories/user.repository';
import { UserService } from '../services/user.service';
import {
  updateProfileSchema,
  becomeMasterSchema,
} from '../schemas/user.schemas';
import { requireAnyRole } from '../middleware/auth.middleware';

export async function userRoutes(app: FastifyInstance) {
  const userRepository = new UserRepository(app.prisma);
  const userService = new UserService(userRepository);

  // GET /api/me - Get current user profile
  app.get(
    '/me',
    {
      preHandler: [requireAnyRole],
    },
    async (request, reply) => {
      try {
        const user = await userService.getOrCreateUser(request.user);

        return {
          success: true,
          data: user,
        };
      } catch (error) {
        app.log.error(
          { error, userId: request.user.id },
          'Failed to get user profile'
        );
        return reply.status(500).send({
          success: false,
          error: 'Internal server error',
        });
      }
    }
  );

  // PUT /api/me - Update user profile
  app.put(
    '/me',
    {
      preHandler: [requireAnyRole],
    },
    async (request, reply) => {
      try {
        const data = updateProfileSchema.parse(request.body);

        const user = await userService.updateProfile(request.user.id, data);

        app.log.info({ userId: request.user.id }, 'User profile updated');
        return {
          success: true,
          data: user,
        };
      } catch (error) {
        if (error instanceof Error && error.name === 'ZodError') {
          return reply.status(400).send({
            success: false,
            error: 'Validation failed',
            details: (error as any).issues,
          });
        }

        app.log.error(
          { error, userId: request.user.id },
          'Failed to update user profile'
        );
        return reply.status(500).send({
          success: false,
          error: 'Internal server error',
        });
      }
    }
  );

  // POST /api/me/become-master - Become a master
  app.post(
    '/me/become-master',
    {
      preHandler: [requireAnyRole],
    },
    async (request, reply) => {
      try {
        const data = becomeMasterSchema.parse(request.body);

        const masterProfile = await userService.becomeMaster(
          request.user.id,
          data
        );

        app.log.info({ userId: request.user.id }, 'User became a master');
        return reply.status(201).send({
          success: true,
          data: masterProfile,
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
          if (error.message === 'User not found') {
            return reply.status(404).send({
              success: false,
              error: error.message,
            });
          }
          if (error.message === 'User is already a master') {
            return reply.status(400).send({
              success: false,
              error: error.message,
            });
          }
        }

        app.log.error(
          { error, userId: request.user.id },
          'Failed to create master profile'
        );
        return reply.status(500).send({
          success: false,
          error: 'Internal server error',
        });
      }
    }
  );
}
