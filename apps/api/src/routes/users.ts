import { FastifyInstance } from 'fastify'
import { updateUserSchema, createMasterProfileSchema } from '@socio-do-tabuleiro/shared'

export async function userRoutes(app: FastifyInstance) {
  // GET /api/me - Auth0 token info (sub, permissions, roles)
  app.get('/me', {
    preHandler: [app.authenticate]
  }, async (request, reply) => {
    return { 
      success: true, 
      data: {
        sub: request.auth.sub,
        permissions: request.auth.permissions,
        roles: request.auth.roles,
        email: request.user.email
      }
    }
  })

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
      app.log.error({ error }, 'Failed to fetch user')
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
        data: {
          name: data.name,
          avatar: data.avatarUrl
        }
      })

      return { success: true, data: user }
    } catch (error) {
      if (error instanceof Error && error.name === 'ZodError') {
        return reply.status(400).send({
          success: false,
          error: 'Validation failed',
          details: (error as any).issues
        })
      }
      
      app.log.error({ error }, 'Failed to update user')
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
      
      // Atualizar role do usuário para MASTER e criar perfil de mestre
      const user = await app.prisma.user.update({
        where: { id: request.user.id },
        data: { role: 'MASTER' }
      })

      const masterProfile = await app.prisma.masterProfile.upsert({
        where: { userId: request.user.id },
        update: { bio: data.bio },
        create: {
          userId: request.user.id,
          bio: data.bio
        }
      })

      return reply.status(201).send({ success: true, data: { user, masterProfile } })
    } catch (error) {
      if (error instanceof Error && error.name === 'ZodError') {
        return reply.status(400).send({
          success: false,
          error: 'Validation failed',
          details: (error as any).issues
        })
      }
      
      app.log.error({ error }, 'Failed to create master profile')
      return reply.status(500).send({
        success: false,
        error: 'Internal server error'
      })
    }
  })
}