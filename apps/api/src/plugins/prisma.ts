
import fp from 'fastify-plugin';
import { FastifyInstance, FastifyPluginAsync } from 'fastify';
import { prisma } from '@socio/db';

// Fix: Explicitly augment the 'fastify' module to include the prisma property in FastifyInstance.
// The import of FastifyInstance above helps the compiler recognize the module for augmentation.
declare module 'fastify' {
  interface FastifyInstance {
    prisma: typeof prisma;
  }
}

const prismaPlugin: FastifyPluginAsync = fp(async (server) => {
  try {
    await prisma.$connect();
    server.log.info('Prisma connected successfully');

    server.decorate('prisma', prisma);

    server.addHook('onClose', async (server) => {
      await server.prisma.$disconnect();
    });
  } catch (error) {
    server.log.error('Failed to connect to Prisma', error);
  }
});

export default prismaPlugin;
