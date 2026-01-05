import { FastifyInstance } from 'fastify'

export async function healthRoutes(app: FastifyInstance) {
  app.get('/health', async () => {
    return { status: 'ok' }
  })

  app.get('/healthz', async () => {
    try {
      await app.prisma.$queryRaw`SELECT 1`
      return { 
        success: true, 
        status: 'healthy',
        timestamp: new Date().toISOString(),
        database: 'connected'
      }
    } catch (error) {
      app.log.error({ error }, 'Health check failed')
      return { 
        success: false, 
        status: 'unhealthy',
        timestamp: new Date().toISOString(),
        database: 'disconnected'
      }
    }
  })
}