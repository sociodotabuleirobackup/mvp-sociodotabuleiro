import path from 'path'
import Fastify from 'fastify'
import cors from '@fastify/cors'
import rateLimit from '@fastify/rate-limit'
import fastifyStatic from '@fastify/static'
import { prismaPlugin } from './plugins/prisma'
import { authPlugin } from './plugins/auth'
import { healthRoutes } from './routes/health'
import { sessionRoutes } from './routes/sessions'
import { userRoutes } from './routes/users'

const server = Fastify({
  logger: {
    level: process.env.LOG_LEVEL || 'info',
    transport: process.env.NODE_ENV === 'development' ? {
      target: 'pino-pretty',
      options: { colorize: true }
    } : undefined
  }
})

async function start() {
  try {
    // Plugins
    await server.register(cors, { 
      origin: process.env.CORS_ORIGIN || true 
    })
    
    await server.register(rateLimit, { 
      max: 100, 
      timeWindow: '1 minute' 
    })
    
    await server.register(prismaPlugin)
    await server.register(authPlugin)

    // Routes
    await server.register(healthRoutes)
    await server.register(sessionRoutes, { prefix: '/api' })
    await server.register(userRoutes, { prefix: '/api' })

    // Serve static files from web app build (production only)
    if (process.env.NODE_ENV === 'production') {
      const webDistPath = path.join(__dirname, '../../web/dist')
      await server.register(fastifyStatic, {
        root: webDistPath,
        prefix: '/',
        decorateReply: false
      })
      
      // SPA fallback - serve index.html for all non-API routes
      server.setNotFoundHandler(async (request, reply) => {
        if (!request.url.startsWith('/api') && !request.url.startsWith('/healthz')) {
          return reply.sendFile('index.html')
        }
        return reply.code(404).send({ error: 'Not found' })
      })
    }

    // Start server
    const PORT = Number(process.env.PORT) || 3000
    const host = '0.0.0.0'
    
    await server.listen({ port: PORT, host })
    
    console.log('Listening on', PORT)
    server.log.info(`🚀 API Server ready at http://${host}:${PORT}`)
  } catch (err) {
    server.log.error(err)
    process.exit(1)
  }
}

start()