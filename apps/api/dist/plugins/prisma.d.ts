import { FastifyPluginAsync } from 'fastify';
import { prisma } from '@socio-do-tabuleiro/database';
declare module 'fastify' {
    interface FastifyInstance {
        prisma: typeof prisma;
    }
}
export declare const prismaPlugin: FastifyPluginAsync;
