import { FastifyInstance } from 'fastify'
import { z } from 'zod'

// Schema de validação para criar sessão
const createSessionSchema = z.object({
  title: z.string().min(3).max(200),
  description: z.string().max(2000).optional(),
  gameSystem: z.string().min(2).max(100),
  maxPlayers: z.number().min(1).max(20),
  price: z.number().min(0),
  duration: z.number().min(30).max(720), // 30min to 12h
  scheduledAt: z.string().datetime(),
  storeId: z.string().optional(),
})

export async function sessionRoutes(app: FastifyInstance) {
  // GET /api/sessions - Listar sessões públicas
  app.get('/sessions', async (request, reply) => {
    try {
      const sessions = await app.prisma.session.findMany({
        where: { status: 'OPEN' },
        include: {
          master: {
            include: {
              user: {
                select: { name: true, avatar: true }
              }
            }
          },
          store: true,
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

  // GET /api/sessions/:id - Detalhes de uma sessão
  app.get('/sessions/:id', async (request, reply) => {
    try {
      const { id } = request.params as { id: string }
      
      const session = await app.prisma.session.findUnique({
        where: { id },
        include: {
          master: {
            include: {
              user: {
                select: { name: true, avatar: true }
              }
            }
          },
          store: true,
          bookings: {
            include: {
              user: {
                select: { id: true, name: true, avatar: true }
              }
            }
          },
          reviews: {
            include: {
              user: {
                select: { name: true, avatar: true }
              }
            }
          }
        }
      })

      if (!session) {
        return reply.status(404).send({
          success: false,
          error: 'Session not found'
        })
      }

      return { success: true, data: session }
    } catch (error) {
      app.log.error({ error }, 'Failed to fetch session')
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
      
      // Verificar se usuário tem perfil de MASTER
      const masterProfile = await app.prisma.masterProfile.findUnique({
        where: { userId: request.user.id }
      })

      if (!masterProfile) {
        return reply.status(403).send({
          success: false,
          error: 'Only masters can create sessions'
        })
      }

      const session = await app.prisma.session.create({
        data: {
          title: data.title,
          description: data.description,
          gameSystem: data.gameSystem,
          maxPlayers: data.maxPlayers,
          price: data.price,
          duration: data.duration,
          scheduledAt: new Date(data.scheduledAt),
          masterId: masterProfile.id,
          storeId: data.storeId,
        },
        include: {
          master: {
            include: {
              user: {
                select: { name: true, avatar: true }
              }
            }
          }
        }
      })

      app.log.info({ sessionId: session.id }, 'Session created')
      return reply.status(201).send({ success: true, data: session })
    } catch (error) {
      if (error instanceof z.ZodError) {
        return reply.status(400).send({
          success: false,
          error: 'Validation failed',
          details: error.issues
        })
      }
      
      app.log.error({ error }, 'Failed to create session')
      return reply.status(500).send({
        success: false,
        error: 'Internal server error'
      })
    }
  })

  // DELETE /api/sessions/:id - Cancelar sessão
  app.delete('/sessions/:id', {
    preHandler: [app.authenticate]
  }, async (request, reply) => {
    try {
      const { id } = request.params as { id: string }
      
      const session = await app.prisma.session.findUnique({
        where: { id },
        include: { master: true }
      })

      if (!session) {
        return reply.status(404).send({
          success: false,
          error: 'Session not found'
        })
      }

      // Verificar se o usuário é o dono da sessão
      const masterProfile = await app.prisma.masterProfile.findUnique({
        where: { userId: request.user.id }
      })

      if (session.masterId !== masterProfile?.id) {
        return reply.status(403).send({
          success: false,
          error: 'Not authorized to delete this session'
        })
      }

      await app.prisma.session.update({
        where: { id },
        data: { status: 'CANCELLED' }
      })

      app.log.info({ sessionId: id }, 'Session cancelled')
      return { success: true, message: 'Session cancelled' }
    } catch (error) {
      app.log.error({ error }, 'Failed to cancel session')
      return reply.status(500).send({
        success: false,
        error: 'Internal server error'
      })
    }
  })
}