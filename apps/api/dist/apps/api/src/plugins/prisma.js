import fp from 'fastify-plugin';
import { prisma } from 'db';
export const prismaPlugin = fp(async (server) => {
    try {
        await prisma.$connect();
        server.log.info('✅ Prisma connected');
        server.decorate('prisma', prisma);
        server.addHook('onClose', async () => {
            await prisma.$disconnect();
            server.log.info('🔌 Prisma disconnected');
        });
    }
    catch (error) {
        server.log.error({ error }, '❌ Prisma connection failed');
        throw error;
    }
});
