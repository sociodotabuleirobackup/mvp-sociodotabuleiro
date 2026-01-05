import { FastifyPluginAsync, FastifyInstance, FastifyRequest, FastifyReply } from 'fastify'
import fp from 'fastify-plugin'

interface AuthorizeOptions {
  anyPermissions?: string[]
  allPermissions?: string[]
  anyRoles?: string[]
  allRoles?: string[]
}

declare module 'fastify' {
  interface FastifyInstance {
    authenticate: (request: FastifyRequest, reply: FastifyReply) => Promise<void>
    requirePermission: (permission: string) => (request: FastifyRequest, reply: FastifyReply) => Promise<void>
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

export const authPlugin: FastifyPluginAsync = fp(async (server: FastifyInstance) => {
  server.log.info('Auth plugin loaded (mock mode - no JWT validation)')

  const authenticate = async (request: FastifyRequest, reply: FastifyReply) => {
    if (request.auth) return

    request.user = { 
      id: 'mock-user-id', 
      email: 'demo@sociodotabuleiro.app' 
    }
    
    request.auth = {
      sub: 'mock-sub-' + Date.now(),
      permissions: ['sessions:read', 'sessions:write', 'sessions:delete', 'bookings:read', 'bookings:write'],
      roles: ['PLAYER', 'MASTER']
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
      
      if (!request.auth.permissions.includes(permission)) {
        return reply.status(403).send({
          success: false,
          error: 'Forbidden',
          code: 'MISSING_PERMISSION',
          detail: `Required permission: ${permission}`
        })
      }
    }
  }

  const requireRole = (role: string) => {
    return async (request: FastifyRequest, reply: FastifyReply) => {
      await authenticate(request, reply)
      if (reply.sent) return
      
      if (isAdmin(request)) return
      
      if (!request.auth.roles.includes(role)) {
        return reply.status(403).send({
          success: false,
          error: 'Forbidden',
          code: 'MISSING_ROLE',
          detail: `Required role: ${role}`
        })
      }
    }
  }

  const requireAnyRole = (roles: string[]) => {
    return async (request: FastifyRequest, reply: FastifyReply) => {
      await authenticate(request, reply)
      if (reply.sent) return
      
      if (isAdmin(request)) return
      
      const hasRole = roles.some(role => request.auth.roles.includes(role))
      if (!hasRole) {
        return reply.status(403).send({
          success: false,
          error: 'Forbidden',
          code: 'MISSING_ROLE',
          detail: `Required one of roles: ${roles.join(', ')}`
        })
      }
    }
  }

  const authorize = (options: AuthorizeOptions) => {
    return async (request: FastifyRequest, reply: FastifyReply) => {
      await authenticate(request, reply)
      if (reply.sent) return
      
      if (isAdmin(request)) return

      if (options.allPermissions) {
        const hasAll = options.allPermissions.every(p => request.auth.permissions.includes(p))
        if (!hasAll) {
          return reply.status(403).send({
            success: false,
            error: 'Forbidden',
            code: 'MISSING_PERMISSIONS',
            detail: `Required all permissions: ${options.allPermissions.join(', ')}`
          })
        }
      }

      if (options.anyPermissions) {
        const hasAny = options.anyPermissions.some(p => request.auth.permissions.includes(p))
        if (!hasAny) {
          return reply.status(403).send({
            success: false,
            error: 'Forbidden',
            code: 'MISSING_PERMISSION',
            detail: `Required one of permissions: ${options.anyPermissions.join(', ')}`
          })
        }
      }

      if (options.allRoles) {
        const hasAll = options.allRoles.every(r => request.auth.roles.includes(r))
        if (!hasAll) {
          return reply.status(403).send({
            success: false,
            error: 'Forbidden',
            code: 'MISSING_ROLES',
            detail: `Required all roles: ${options.allRoles.join(', ')}`
          })
        }
      }

      if (options.anyRoles) {
        const hasAny = options.anyRoles.some(r => request.auth.roles.includes(r))
        if (!hasAny) {
          return reply.status(403).send({
            success: false,
            error: 'Forbidden',
            code: 'MISSING_ROLE',
            detail: `Required one of roles: ${options.anyRoles.join(', ')}`
          })
        }
      }
    }
  }

  server.decorate('authenticate', authenticate)
  server.decorate('requirePermission', requirePermission)
  server.decorate('requireRole', requireRole)
  server.decorate('requireAnyRole', requireAnyRole)
  server.decorate('authorize', authorize)
})
