import { FastifyInstance } from 'fastify'
import { createSessionSchema } from '@socio-do-tabuleiro/shared'

export async function sessionRoutes(app: FastifyInstance) {
  // GET /api/sessions - Listar sessões públicas
  app.get('/sessions', async (request, reply) => {
    try {
      const sessions = await app.prisma.session.findMany({
        where: { status: 'OPEN' },
        include: {
          master: true,
          venue: true,
          _count: { select: { bookings: true } }
        },
        orderBy: { scheduledAt: 'asc' }
      })

      return { success: true, data: sessions }
    } catch (error) {
      app.log.error({ error }, 'Failed to fetch sessions')
      return reply.status(500).send({ 
        success: false, 
        error: 'Internal server error' 
      })
    }
  })

  // POST /api/sessions - Criar sessão (autenticado)
  app.post('/sessions', {
    preHandler: [app.authenticate]
  }, async (request, reply) => {
    try {
      const data = createSessionSchema.parse(request.body)
      
      // Verificar se usuário é MASTER
      const profile = await app.prisma.profile.findUnique({
        where: { id: request.user.id }
      })

      if (profile?.role !== 'MASTER') {
        return reply.status(403).send({
          success: false,
          error: 'Only masters can create sessions'
        })
      }

      const session = await app.prisma.session.create({
        data: {
          ...data,
          masterId: request.user.id
        },
        include: {
          master: true
        }
      })

      return reply.status(201).send({ success: true, data: session })
    } catch (error) {
      if (error instanceof Error && error.name === 'ZodError') {
        return reply.status(400).send({
          success: false,
          error: 'Validation failed',
          details: (error as any).issues
        })
      }
      
      app.log.error({ error }, 'Failed to create session')
      return reply.status(500).send({
        success: false,
        error: 'Internal server error'
      })
    }
  })
}