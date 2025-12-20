import { FastifyRequest, FastifyReply } from 'fastify';
import { UserRole } from '@socio-do-tabuleiro/database';
export declare const requireRole: (allowedRoles: UserRole[]) => (request: FastifyRequest, reply: FastifyReply) => Promise<undefined>;
export declare const requireMaster: (request: FastifyRequest, reply: FastifyReply) => Promise<undefined>;
export declare const requirePlayer: (request: FastifyRequest, reply: FastifyReply) => Promise<undefined>;
export declare const requireStore: (request: FastifyRequest, reply: FastifyReply) => Promise<undefined>;
export declare const requireMasterOrStore: (request: FastifyRequest, reply: FastifyReply) => Promise<undefined>;
export declare const requireAnyRole: (request: FastifyRequest, reply: FastifyReply) => Promise<undefined>;
