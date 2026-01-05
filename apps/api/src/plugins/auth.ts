import fp from 'fastify-plugin'
import { FastifyInstance, FastifyPluginAsync, FastifyRequest, FastifyReply } from 'fastify'
import { createRemoteJWKSet, jwtVerify, JWTPayload } from 'jose'

interface Auth0TokenPayload extends JWTPayload {
  sub: string
  email?: string
  permissions?: string[]
  'https://sociodotabuleiro.app/roles'?: string[]
}

declare module 'fastify' {
  interface FastifyInstance {
    authenticate: (request: FastifyRequest, reply: FastifyReply) => Promise<void>
    requirePermission: (permission: string) => (request: FastifyRequest, reply: FastifyReply) => Promise<void>
    requireAnyPermission: (permissions: string[]) => (request: FastifyRequest, reply: FastifyReply) => Promise<void>
  }
  interface FastifyRequest {
    user: {
      id: string
      email: string
    }
    auth: {
      sub: string
      permissions: string[]
      roles: string[]
    }
  }
}

export const authPlugin: FastifyPluginAsync = fp(async (server: FastifyInstance) => {
  const issuerBaseUrl = process.env.AUTH0_ISSUER_BASE_URL || 'https://app-sociodotabuleiro.us.auth0.com/'
  const audience = process.env.AUTH0_AUDIENCE || 'https://api.sociodotabuleiro'
  
  const issuer = issuerBaseUrl.endsWith('/') ? issuerBaseUrl : `${issuerBaseUrl}/`
  
  const JWKS = createRemoteJWKSet(
    new URL(`${issuer}.well-known/jwks.json`)
  )

  server.log.info({ issuer, audience }, 'Auth0 JWT validation configured')

  const authenticate = async (request: FastifyRequest, reply: FastifyReply) => {
    const authHeader = request.headers.authorization

    if (!authHeader?.startsWith('Bearer ')) {
      return reply.status(401).send({ 
        success: false, 
        error: 'Missing or invalid authorization header' 
      })
    }

    const token = authHeader.split(' ')[1]

    try {
      const { payload } = await jwtVerify(token, JWKS, {
        issuer: issuer,
        audience: audience,
      })

      const auth0Payload = payload as Auth0TokenPayload

      if (!auth0Payload.sub) {
        throw new Error('Invalid token payload: missing sub')
      }

      request.user = { 
        id: auth0Payload.sub, 
        email: auth0Payload.email || '' 
      }
      
      request.auth = {
        sub: auth0Payload.sub,
        permissions: auth0Payload.permissions || [],
        roles: auth0Payload['https://sociodotabuleiro.app/roles'] || []
      }
      
    } catch (error) {
      server.log.warn({ error }, 'Auth0 authentication failed')
      return reply.status(401).send({ 
        success: false, 
        error: 'Invalid token' 
      })
    }
  }

  server.decorate('authenticate', authenticate)

  const requirePermission = (permission: string) => {
    return async (request: FastifyRequest, reply: FastifyReply) => {
      await authenticate(request, reply)
      
      if (!request.auth?.permissions?.includes(permission)) {
        return reply.status(403).send({
          success: false,
          error: `Missing required permission: ${permission}`
        })
      }
    }
  }

  const requireAnyPermission = (permissions: string[]) => {
    return async (request: FastifyRequest, reply: FastifyReply) => {
      await authenticate(request, reply)
      
      const hasPermission = permissions.some(p => request.auth?.permissions?.includes(p))
      if (!hasPermission) {
        return reply.status(403).send({
          success: false,
          error: `Missing required permission. Need one of: ${permissions.join(', ')}`
        })
      }
    }
  }

  server.decorate('requirePermission', requirePermission)
  server.decorate('requireAnyPermission', requireAnyPermission)
})
