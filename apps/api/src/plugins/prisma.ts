import fp from 'fastify-plugin'
import { FastifyInstance, FastifyPluginAsync } from 'fastify'
import { prisma } from 'db'

declare module 'fastify' {
  interface FastifyInstance {
    prisma: typeof prisma
  }
}

export const prismaPlugin: FastifyPluginAsync = fp(async (server: FastifyInstance) => {
  try {
    await prisma.$connect()
    server.log.info('✅ Prisma connected')

    server.decorate('prisma', prisma)

    server.addHook('onClose', async () => {
      await prisma.$disconnect()
      server.log.info('🔌 Prisma disconnected')
    })
  } catch (error) {
    server.log.error('❌ Prisma connection failed:', error)
    throw error
  }
})