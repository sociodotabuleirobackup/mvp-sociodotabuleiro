import { FastifyInstance } from 'fastify'
import { createSessionSchema } from '@socio-do-tabuleiro/shared'

export async function sessionRoutes(app: FastifyInstance) {
  // GET /api/sessions - Listar sessões públicas (sem auth)
  app.get('/sessions', async (request, reply) => {
    try {
      const sessions = await app.prisma.session.findMany({
        where: { status: 'OPEN' },
        include: {
          master: true,
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

  // POST /api/sessions - Criar sessão
  // Requer: permission sessions:write E role MASTER ou VENUE
  app.post('/sessions', {
    preHandler: [
      app.authorize({ 
        anyPermissions: ['sessions:write', 'admin:all'],
        anyRoles: ['MASTER', 'VENUE', 'ADMIN']
      })
    ]
  }, async (request, reply) => {
    try {
      const data = createSessionSchema.parse(request.body)
      
      const user = await app.prisma.user.findUnique({
        where: { auth0Sub: request.auth.sub },
        include: { masterProfile: true }
      })

      if (!user) {
        return reply.status(404).send({
          success: false,
          error: 'User not found'
        })
      }

      let masterId: string | null = null
      
      if (user.masterProfile) {
        masterId = user.masterProfile.id
      } else if (user.role === 'MASTER') {
        const masterProfile = await app.prisma.masterProfile.create({
          data: { userId: user.id, bio: '' }
        })
        masterId = masterProfile.id
      }

      if (!masterId) {
        return reply.status(403).send({
          success: false,
          error: 'Forbidden',
          code: 'NO_MASTER_PROFILE',
          detail: 'User must have a master profile to create sessions'
        })
      }

      const session = await app.prisma.session.create({
        data: {
          title: data.title,
          description: data.description,
          gameSystem: data.system,
          maxPlayers: data.playersMax,
          price: data.price,
          duration: 180,
          scheduledAt: new Date(data.date),
          masterId: masterId
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

  // GET /api/sessions/:id - Detalhes da sessão (público)
  app.get('/sessions/:id', async (request, reply) => {
    try {
      const { id } = request.params as { id: string }
      
      const session = await app.prisma.session.findUnique({
        where: { id },
        include: {
          master: { include: { user: true } },
          store: true,
          bookings: { include: { user: true } }
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

  // DELETE /api/sessions/:id - Deletar sessão
  // Requer: admin:all OU (sessions:delete + dono da sessão)
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

      const isOwner = session.master?.userId === request.user.id
      const hasDeletePermission = request.auth.permissions.includes('sessions:delete')
      const isAdmin = request.auth.roles.includes('ADMIN') || 
                      request.auth.permissions.includes('admin:all')

      if (!isAdmin && !(hasDeletePermission && isOwner)) {
        return reply.status(403).send({
          success: false,
          error: 'Forbidden',
          code: 'NOT_OWNER_OR_ADMIN',
          detail: 'Must be admin or session owner with sessions:delete permission'
        })
      }

      await app.prisma.session.delete({ where: { id } })

      return { success: true, data: { deleted: true } }
    } catch (error) {
      app.log.error({ error }, 'Failed to delete session')
      return reply.status(500).send({
        success: false,
        error: 'Internal server error'
      })
    }
  })
}
