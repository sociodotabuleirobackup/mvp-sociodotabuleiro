import { FastifyInstance } from 'fastify'
import { updateUserSchema, createMasterProfileSchema, createStoreProfileSchema } from 'shared'

export async function userRoutes(app: FastifyInstance) {
  // GET /api/users/me - Perfil do usuário autenticado
  app.get('/users/me', {
    preHandler: [app.authenticate]
  }, async (request, reply) => {
    try {
      const user = await app.prisma.user.findUnique({
        where: { id: request.user.id },
        include: {
          masterProfile: true,
          storeProfile: true
        }
      })

      if (!user) {
        return reply.status(404).send({
          success: false,
          error: 'User not found'
        })
      }

      return { success: true, data: user }
    } catch (error) {
      app.log.error('Failed to fetch user:', error)
      return reply.status(500).send({
        success: false,
        error: 'Internal server error'
      })
    }
  })

  // PUT /api/users/me - Atualizar perfil
  app.put('/users/me', {
    preHandler: [app.authenticate]
  }, async (request, reply) => {
    try {
      const data = updateUserSchema.parse(request.body)
      
      const user = await app.prisma.user.update({
        where: { id: request.user.id },
        data,
        include: {
          masterProfile: true,
          storeProfile: true
        }
      })

      return { success: true, data: user }
    } catch (error) {
      if (error.name === 'ZodError') {
        return reply.status(400).send({
          success: false,
          error: 'Validation failed',
          details: error.issues
        })
      }
      
      app.log.error('Failed to update user:', error)
      return reply.status(500).send({
        success: false,
        error: 'Internal server error'
      })
    }
  })

  // POST /api/users/master-profile - Criar perfil de mestre
  app.post('/users/master-profile', {
    preHandler: [app.authenticate]
  }, async (request, reply) => {
    try {
      const data = createMasterProfileSchema.parse(request.body)
      
      const profile = await app.prisma.masterProfile.create({
        data: {
          ...data,
          userId: request.user.id
        }
      })

      // Atualizar role do usuário
      await app.prisma.user.update({
        where: { id: request.user.id },
        data: { role: 'MASTER' }
      })

      return reply.status(201).send({ success: true, data: profile })
    } catch (error) {
      if (error.name === 'ZodError') {
        return reply.status(400).send({
          success: false,
          error: 'Validation failed',
          details: error.issues
        })
      }
      
      app.log.error('Failed to create master profile:', error)
      return reply.status(500).send({
        success: false,
        error: 'Internal server error'
      })
    }
  })
}