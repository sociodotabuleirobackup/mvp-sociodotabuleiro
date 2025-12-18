import { FastifyRequest, FastifyReply } from 'fastify';
import { UserRole } from '@socio-do-tabuleiro/database';

export const requireRole = (allowedRoles: UserRole[]) => {
  return async (request: FastifyRequest, reply: FastifyReply) => {
    // First ensure user is authenticated
    await request.server.authenticate(request, reply);

    // Get user from database to check role
    const user = await request.server.prisma.user.findUnique({
      where: { id: request.user.id },
      select: { role: true },
    });

    if (!user) {
      return reply.status(404).send({
        success: false,
        error: 'User not found',
      });
    }

    if (!allowedRoles.includes(user.role)) {
      return reply.status(403).send({
        success: false,
        error: `Access denied. Required roles: ${allowedRoles.join(', ')}`,
      });
    }
  };
};

export const requireMaster = requireRole([UserRole.MASTER]);
export const requirePlayer = requireRole([UserRole.PLAYER]);
export const requireStore = requireRole([UserRole.STORE]);
export const requireMasterOrStore = requireRole([
  UserRole.MASTER,
  UserRole.STORE,
]);
export const requireAnyRole = requireRole([
  UserRole.PLAYER,
  UserRole.MASTER,
  UserRole.STORE,
  UserRole.ADMIN,
]);
