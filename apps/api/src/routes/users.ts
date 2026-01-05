import { FastifyInstance } from 'fastify'
import { updateUserSchema, createMasterProfileSchema } from '@socio-do-tabuleiro/shared'

export async function userRoutes(app: FastifyInstance) {
  // GET /api/me - Auth0 token info + upsert user in DB
  app.get('/me', {
    preHandler: [app.authenticate]
  }, async (request, reply) => {
    try {
      const user = await app.prisma.user.upsert({
        where: { auth0Sub: request.auth.sub },
        update: {
          ...(request.user.email && { email: request.user.email }),
        },
        create: {
          auth0Sub: request.auth.sub,
          email: request.user.email || null,
          name: null,
          role: 'PLAYER'
        },
        include: {
          masterProfile: true,
          storeProfile: true
        }
      })

      request.user.id = user.id

      return { 
        success: true, 
        data: {
          id: user.id,
          auth0Sub: user.auth0Sub,
          email: user.email,
          name: user.name,
          role: user.role,
          permissions: request.auth.permissions,
          roles: request.auth.roles,
          masterProfile: user.masterProfile,
          storeProfile: user.storeProfile
        }
      }
    } catch (error) {
      app.log.error({ error }, 'Failed to upsert user')
      return reply.status(500).send({
        success: false,
        error: 'Internal server error'
      })
    }
  })

  // GET /api/users/me - Perfil do usuário autenticado
  app.get('/users/me', {
    preHandler: [app.authenticate]
  }, async (request, reply) => {
    try {
      const user = await app.prisma.user.findUnique({
        where: { auth0Sub: request.auth.sub },
        include: {
          masterProfile: true,
          storeProfile: true
        }
      })

      if (!user) {
        return reply.status(404).send({
          success: false,
          error: 'User not found. Call /api/me first to provision user.'
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
        where: { auth0Sub: request.auth.sub },
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
      
      const existingUser = await app.prisma.user.findUnique({
        where: { auth0Sub: request.auth.sub }
      })

      if (!existingUser) {
        return reply.status(404).send({
          success: false,
          error: 'User not found. Call /api/me first to provision user.'
        })
      }

      const user = await app.prisma.user.update({
        where: { auth0Sub: request.auth.sub },
        data: { role: 'MASTER' }
      })

      const masterProfile = await app.prisma.masterProfile.upsert({
        where: { userId: user.id },
        update: { bio: data.bio },
        create: {
          userId: user.id,
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