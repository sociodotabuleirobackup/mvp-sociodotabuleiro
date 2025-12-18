import { FastifyInstance } from 'fastify'
import { z } from 'zod'

// Schemas de validação
const updateUserSchema = z.object({
  name: z.string().min(2).max(100).optional(),
  avatar: z.string().url().optional(),
})

const createMasterProfileSchema = z.object({
  bio: z.string().max(500).optional(),
})

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
          storeProfile: true,
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
        data,
        include: {
          masterProfile: true,
          storeProfile: true,
        }
      })

      app.log.info({ userId: user.id }, 'User profile updated')
      return { success: true, data: user }
    } catch (error) {
      if (error instanceof z.ZodError) {
        return reply.status(400).send({
          success: false,
          error: 'Validation failed',
          details: error.issues
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
      
      // Verificar se já tem perfil de master
      const existingProfile = await app.prisma.masterProfile.findUnique({
        where: { userId: request.user.id }
      })

      if (existingProfile) {
        return reply.status(400).send({
          success: false,
          error: 'Master profile already exists'
        })
      }

      // Criar perfil de master e atualizar role do usuário
      const [masterProfile] = await app.prisma.$transaction([
        app.prisma.masterProfile.create({
          data: {
            userId: request.user.id,
            bio: data.bio,
          }
        }),
        app.prisma.user.update({
          where: { id: request.user.id },
          data: { role: 'MASTER' }
        })
      ])

      app.log.info({ userId: request.user.id }, 'Master profile created')
      return reply.status(201).send({ success: true, data: masterProfile })
    } catch (error) {
      if (error instanceof z.ZodError) {
        return reply.status(400).send({
          success: false,
          error: 'Validation failed',
          details: error.issues
        })
      }
      
      app.log.error({ error }, 'Failed to create master profile')
      return reply.status(500).send({
        success: false,
        error: 'Internal server error'
      })
    }
  })

  // GET /api/users/:id - Perfil público de um usuário
  app.get('/users/:id', async (request, reply) => {
    try {
      const { id } = request.params as { id: string }
      
      const user = await app.prisma.user.findUnique({
        where: { id },
        select: {
          id: true,
          name: true,
          avatar: true,
          role: true,
          createdAt: true,
          masterProfile: {
            select: {
              bio: true,
              rating: true,
              totalGames: true,
            }
          }
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
}