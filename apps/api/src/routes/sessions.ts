import { FastifyInstance } from 'fastify'
import { SessionRepository } from '../repositories/session.repository'
import { UserRepository } from '../repositories/user.repository'
import { SessionService } from '../services/session.service'
import { UserService } from '../services/user.service'
import { createSessionSchema, updateSessionSchema, sessionFiltersSchema } from '../schemas/session.schemas'
import { requireMaster, requireAnyRole } from '../middleware/auth.middleware'

export async function sessionRoutes(app: FastifyInstance) {
  const sessionRepository = new SessionRepository(app.prisma)
  const userRepository = new UserRepository(app.prisma)
  const userService = new UserService(userRepository)
  const sessionService = new SessionService(sessionRepository, userService)

  // GET /api/sessions - List sessions with filters
  app.get('/sessions', async (request, reply) => {
    try {
      const filters = sessionFiltersSchema.parse(request.query)
      
      const sessions = await sessionService.getSessions(filters)
      
      return {
        success: true,
        data: sessions,
        count: sessions.length
      }
    } catch (error) {
      if (error instanceof Error && error.name === 'ZodError') {
        return reply.status(400).send({
          success: false,
          error: 'Invalid filters',
          details: (error as any).issues
        })
      }
      
      app.log.error({ error }, 'Failed to fetch sessions')
      return reply.status(500).send({
        success: false,
        error: 'Internal server error'
      })
    }
  })

  // GET /api/sessions/:id - Get session details
  app.get('/sessions/:id', async (request, reply) => {
    try {
      const { id } = request.params as { id: string }
      
      const session = await sessionService.getSessionById(id)
      
      return {
        success: true,
        data: session
      }
    } catch (error) {
      if (error instanceof Error && error.message === 'Session not found') {
        return reply.status(404).send({
          success: false,
          error: error.message
        })
      }
      
      app.log.error({ error, sessionId: (request.params as any).id }, 'Failed to fetch session')
      return reply.status(500).send({
        success: false,
        error: 'Internal server error'
      })
    }
  })

  // POST /api/sessions - Create session (masters only)
  app.post('/sessions', {
    preHandler: [requireMaster]
  }, async (request, reply) => {
    try {
      const data = createSessionSchema.parse(request.body)
      
      const session = await sessionService.createSession(request.user.id, data)
      
      app.log.info({ 
        sessionId: session.id, 
        masterId: request.user.id 
      }, 'Session created')
      
      return reply.status(201).send({
        success: true,
        data: session
      })
    } catch (error) {
      if (error instanceof Error && error.name === 'ZodError') {
        return reply.status(400).send({
          success: false,
          error: 'Validation failed',
          details: (error as any).issues
        })
      }

      if (error instanceof Error) {
        const businessErrors = [
          'User is not authorized to create sessions',
          'Master profile not found',
          'Session must be scheduled in the future',
          'Session duration must be between 30 minutes and 12 hours',
          'Max players must be between 1 and 20',
          'Price cannot be negative'
        ]
        
        if (businessErrors.includes(error.message)) {
          return reply.status(400).send({
            success: false,
            error: error.message
          })
        }
      }
      
      app.log.error({ error, masterId: request.user.id }, 'Failed to create session')
      return reply.status(500).send({
        success: false,
        error: 'Internal server error'
      })
    }
  })

  // PUT /api/sessions/:id - Update session (master only)
  app.put('/sessions/:id', {
    preHandler: [requireMaster]
  }, async (request, reply) => {
    try {
      const { id } = request.params as { id: string }
      const data = updateSessionSchema.parse(request.body)
      
      const session = await sessionService.updateSession(id, request.user.id, data)
      
      app.log.info({ 
        sessionId: id, 
        masterId: request.user.id 
      }, 'Session updated')
      
      return {
        success: true,
        data: session
      }
    } catch (error) {
      if (error instanceof Error && error.name === 'ZodError') {
        return reply.status(400).send({
          success: false,
          error: 'Validation failed',
          details: (error as any).issues
        })
      }

      if (error instanceof Error) {
        if (error.message === 'Session not found') {
          return reply.status(404).send({
            success: false,
            error: error.message
          })
        }
        
        const businessErrors = [
          'Not authorized to update this session',
          'Cannot update a session that is not open',
          'Session must be scheduled in the future'
        ]
        
        if (businessErrors.includes(error.message)) {
          return reply.status(400).send({
            success: false,
            error: error.message
          })
        }
      }
      
      app.log.error({ 
        error, 
        sessionId: (request.params as any).id, 
        masterId: request.user.id 
      }, 'Failed to update session')
      
      return reply.status(500).send({
        success: false,
        error: 'Internal server error'
      })
    }
  })

  // DELETE /api/sessions/:id - Cancel session (master only)
  app.delete('/sessions/:id', {
    preHandler: [requireMaster]
  }, async (request, reply) => {
    try {
      const { id } = request.params as { id: string }
      
      await sessionService.cancelSession(id, request.user.id)
      
      app.log.info({ 
        sessionId: id, 
        masterId: request.user.id 
      }, 'Session cancelled')
      
      return {
        success: true,
        message: 'Session cancelled successfully'
      }
    } catch (error) {
      if (error instanceof Error) {
        if (error.message === 'Session not found') {
          return reply.status(404).send({
            success: false,
            error: error.message
          })
        }
        
        const businessErrors = [
          'Not authorized to cancel this session',
          'Session is already cancelled',
          'Cannot cancel a completed session'
        ]
        
        if (businessErrors.includes(error.message)) {
          return reply.status(400).send({
            success: false,
            error: error.message
          })
        }
      }
      
      app.log.error({ 
        error, 
        sessionId: (request.params as any).id, 
        masterId: request.user.id 
      }, 'Failed to cancel session')
      
      return reply.status(500).send({
        success: false,
        error: 'Internal server error'
      })
    }
  })
}