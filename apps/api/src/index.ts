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

const isProduction = process.env.NODE_ENV === 'production'

const ALLOWED_ORIGINS = [
  'http://localhost:3000',
  'http://localhost:5173',
  'http://localhost:5000',
  'https://mvp-sociodotabuleiro.replit.app',
  /\.replit\.dev$/,
  /\.replit\.app$/
]

const server = Fastify({
  logger: {
    level: process.env.LOG_LEVEL || 'info',
    transport: !isProduction ? {
      target: 'pino-pretty',
      options: { colorize: true }
    } : undefined
  }
})

async function start() {
  try {
    await server.register(cors, {
      origin: (origin, cb) => {
        if (!origin) {
          cb(null, true)
          return
        }
        
        const isAllowed = ALLOWED_ORIGINS.some(allowed => {
          if (typeof allowed === 'string') {
            return origin === allowed
          }
          return allowed.test(origin)
        })
        
        if (isAllowed) {
          cb(null, true)
        } else {
          server.log.warn({ origin }, 'CORS request blocked')
          cb(new Error('Not allowed by CORS'), false)
        }
      },
      credentials: true,
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
    })
    
    await server.register(rateLimit, { 
      global: false
    })
    
    await server.register(prismaPlugin)
    await server.register(authPlugin)

    server.setErrorHandler((error, request, reply) => {
      const statusCode = error.statusCode || 500
      
      if (statusCode === 429) {
        return reply.status(429).send({
          success: false,
          error: 'Too Many Requests',
          code: 'RATE_LIMIT_EXCEEDED',
          detail: 'Please slow down and try again later'
        })
      }
      
      if (statusCode === 401) {
        return reply.status(401).send({
          success: false,
          error: 'Unauthorized',
          code: 'AUTHENTICATION_REQUIRED'
        })
      }
      
      if (statusCode === 403) {
        return reply.status(403).send({
          success: false,
          error: 'Forbidden',
          code: 'ACCESS_DENIED'
        })
      }
      
      if (isProduction && statusCode >= 500) {
        server.log.error({ error }, 'Internal server error')
        return reply.status(500).send({
          success: false,
          error: 'Internal Server Error',
          code: 'INTERNAL_ERROR'
        })
      }
      
      return reply.status(statusCode).send({
        success: false,
        error: error.message,
        code: error.code || 'UNKNOWN_ERROR',
        ...(isProduction ? {} : { stack: error.stack })
      })
    })

    await server.register(healthRoutes)
    
    await server.register(async (app) => {
      await app.register(rateLimit, {
        max: 60,
        timeWindow: '1 minute',
        keyGenerator: (request) => {
          return request.headers.authorization?.split(' ')[1] || request.ip
        }
      })
      
      await app.register(sessionRoutes)
      await app.register(userRoutes)
    }, { prefix: '/api' })

    if (isProduction) {
      const webDistPath = path.resolve(process.cwd(), 'apps/web/dist')
      await server.register(fastifyStatic, {
        root: webDistPath,
        prefix: '/'
      })
      
      server.setNotFoundHandler(async (request, reply) => {
        if (!request.url.startsWith('/api') && !request.url.startsWith('/healthz')) {
          return reply.sendFile('index.html')
        }
        return reply.code(404).send({ 
          success: false,
          error: 'Not Found',
          code: 'ROUTE_NOT_FOUND'
        })
      })
    }

    const PORT = Number(process.env.PORT) || 5000
    const host = '0.0.0.0'
    
    await server.listen({ port: PORT, host })
    
    console.log('Listening on', PORT)
    server.log.info(`🚀 API Server ready at http://${host}:${PORT}`)
    server.log.info({ allowedOrigins: ALLOWED_ORIGINS.map(o => o.toString()) }, 'CORS configured')
  } catch (err) {
    server.log.error(err)
    process.exit(1)
  }
}

start()
