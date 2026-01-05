import fp from 'fastify-plugin'
import { FastifyInstance, FastifyPluginAsync, FastifyRequest, FastifyReply } from 'fastify'
import { createRemoteJWKSet, jwtVerify, JWTPayload } from 'jose'

interface Auth0TokenPayload extends JWTPayload {
  sub: string
  email?: string
  permissions?: string[]
  'https://sociodotabuleiro.app/roles'?: string[]
}

interface AuthorizeOptions {
  permissions?: string[]
  anyPermissions?: string[]
  roles?: string[]
  anyRoles?: string[]
  allowAdmin?: boolean
}

declare module 'fastify' {
  interface FastifyInstance {
    authenticate: (request: FastifyRequest, reply: FastifyReply) => Promise<void>
    requirePermission: (permission: string) => (request: FastifyRequest, reply: FastifyReply) => Promise<void>
    requireAnyPermission: (permissions: string[]) => (request: FastifyRequest, reply: FastifyReply) => Promise<void>
    requireRole: (role: string) => (request: FastifyRequest, reply: FastifyReply) => Promise<void>
    requireAnyRole: (roles: string[]) => (request: FastifyRequest, reply: FastifyReply) => Promise<void>
    authorize: (options: AuthorizeOptions) => (request: FastifyRequest, reply: FastifyReply) => Promise<void>
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

const sendForbidden = (reply: FastifyReply, code: string, detail: string) => {
  return reply.status(403).send({
    success: false,
    error: 'Forbidden',
    code,
    detail
  })
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
    if (request.auth) return

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

      if (!auth0Payload.iss || auth0Payload.iss !== issuer) {
        server.log.warn({ expected: issuer, got: auth0Payload.iss }, 'Token issuer mismatch')
        return reply.status(401).send({ 
          success: false, 
          error: 'Unauthorized',
          code: 'INVALID_ISSUER'
        })
      }

      if (!auth0Payload.aud) {
        server.log.warn('Token missing audience')
        return reply.status(401).send({ 
          success: false, 
          error: 'Unauthorized',
          code: 'MISSING_AUDIENCE'
        })
      }

      if (!auth0Payload.sub) {
        return reply.status(401).send({ 
          success: false, 
          error: 'Unauthorized',
          code: 'INVALID_TOKEN'
        })
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
      const isProduction = process.env.NODE_ENV === 'production'
      if (!isProduction) {
        server.log.warn({ error }, 'Auth0 authentication failed')
      }
      return reply.status(401).send({ 
        success: false, 
        error: 'Unauthorized',
        code: 'AUTHENTICATION_FAILED'
      })
    }
  }

  const isAdmin = (request: FastifyRequest): boolean => {
    return request.auth?.roles?.includes('ADMIN') || 
           request.auth?.permissions?.includes('admin:all')
  }

  const requirePermission = (permission: string) => {
    return async (request: FastifyRequest, reply: FastifyReply) => {
      await authenticate(request, reply)
      if (reply.sent) return
      
      if (isAdmin(request)) return
      
      if (!request.auth?.permissions?.includes(permission)) {
        return sendForbidden(reply, 'MISSING_PERMISSION', `Required permission: ${permission}`)
      }
    }
  }

  const requireAnyPermission = (permissions: string[]) => {
    return async (request: FastifyRequest, reply: FastifyReply) => {
      await authenticate(request, reply)
      if (reply.sent) return
      
      if (isAdmin(request)) return
      
      const hasPermission = permissions.some(p => request.auth?.permissions?.includes(p))
      if (!hasPermission) {
        return sendForbidden(reply, 'MISSING_PERMISSION', `Required one of: ${permissions.join(', ')}`)
      }
    }
  }

  const requireRole = (role: string) => {
    return async (request: FastifyRequest, reply: FastifyReply) => {
      await authenticate(request, reply)
      if (reply.sent) return
      
      if (isAdmin(request)) return
      
      if (!request.auth?.roles?.includes(role)) {
        return sendForbidden(reply, 'MISSING_ROLE', `Required role: ${role}`)
      }
    }
  }

  const requireAnyRole = (roles: string[]) => {
    return async (request: FastifyRequest, reply: FastifyReply) => {
      await authenticate(request, reply)
      if (reply.sent) return
      
      if (isAdmin(request)) return
      
      const hasRole = roles.some(r => request.auth?.roles?.includes(r))
      if (!hasRole) {
        return sendForbidden(reply, 'MISSING_ROLE', `Required one of: ${roles.join(', ')}`)
      }
    }
  }

  const authorize = (options: AuthorizeOptions) => {
    return async (request: FastifyRequest, reply: FastifyReply) => {
      await authenticate(request, reply)
      if (reply.sent) return

      const { permissions, anyPermissions, roles, anyRoles, allowAdmin = true } = options

      if (allowAdmin && isAdmin(request)) return

      if (permissions) {
        const hasAll = permissions.every(p => request.auth?.permissions?.includes(p))
        if (!hasAll) {
          return sendForbidden(reply, 'MISSING_PERMISSION', `Required permissions: ${permissions.join(', ')}`)
        }
      }

      if (anyPermissions) {
        const hasAny = anyPermissions.some(p => request.auth?.permissions?.includes(p))
        if (!hasAny) {
          return sendForbidden(reply, 'MISSING_PERMISSION', `Required one of: ${anyPermissions.join(', ')}`)
        }
      }

      if (roles) {
        const hasAll = roles.every(r => request.auth?.roles?.includes(r))
        if (!hasAll) {
          return sendForbidden(reply, 'MISSING_ROLE', `Required roles: ${roles.join(', ')}`)
        }
      }

      if (anyRoles) {
        const hasAny = anyRoles.some(r => request.auth?.roles?.includes(r))
        if (!hasAny) {
          return sendForbidden(reply, 'MISSING_ROLE', `Required one of: ${anyRoles.join(', ')}`)
        }
      }
    }
  }

  server.decorate('authenticate', authenticate)
  server.decorate('requirePermission', requirePermission)
  server.decorate('requireAnyPermission', requireAnyPermission)
  server.decorate('requireRole', requireRole)
  server.decorate('requireAnyRole', requireAnyRole)
  server.decorate('authorize', authorize)
})
