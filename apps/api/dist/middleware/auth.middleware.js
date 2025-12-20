"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.requireAnyRole = exports.requireMasterOrStore = exports.requireStore = exports.requirePlayer = exports.requireMaster = exports.requireRole = void 0;
const database_1 = require("@socio-do-tabuleiro/database");
const requireRole = (allowedRoles) => {
    return async (request, reply) => {
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
exports.requireRole = requireRole;
exports.requireMaster = (0, exports.requireRole)([database_1.UserRole.MASTER]);
exports.requirePlayer = (0, exports.requireRole)([database_1.UserRole.PLAYER]);
exports.requireStore = (0, exports.requireRole)([database_1.UserRole.STORE]);
exports.requireMasterOrStore = (0, exports.requireRole)([
    database_1.UserRole.MASTER,
    database_1.UserRole.STORE,
]);
exports.requireAnyRole = (0, exports.requireRole)([
    database_1.UserRole.PLAYER,
    database_1.UserRole.MASTER,
    database_1.UserRole.STORE,
    database_1.UserRole.ADMIN,
]);
