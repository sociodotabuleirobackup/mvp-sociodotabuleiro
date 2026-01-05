import { FastifyPluginAsync, FastifyRequest, FastifyReply } from 'fastify'
import fp from 'fastify-plugin'

export interface AuditEvent {
  action: string
  actorSub: string
  actorId?: string
  targetType?: string
  targetId?: string
  detail?: Record<string, unknown>
  timestamp: Date
}

declare module 'fastify' {
  interface FastifyInstance {
    audit: (event: Omit<AuditEvent, 'timestamp'>) => void
  }
}

export const auditPlugin: FastifyPluginAsync = fp(async (server) => {
  server.decorate('audit', (event: Omit<AuditEvent, 'timestamp'>) => {
    const fullEvent: AuditEvent = {
      ...event,
      timestamp: new Date()
    }
    
    server.log.info({
      audit: true,
      action: fullEvent.action,
      actorSub: fullEvent.actorSub,
      actorId: fullEvent.actorId,
      targetType: fullEvent.targetType,
      targetId: fullEvent.targetId,
      detail: fullEvent.detail,
      timestamp: fullEvent.timestamp.toISOString()
    }, `AUDIT: ${fullEvent.action}`)
  })

  server.addHook('onResponse', async (request: FastifyRequest, reply: FastifyReply) => {
    const sub = (request as any).auth?.sub || 'anonymous'
    const route = request.routeOptions?.url || request.url
    const method = request.method
    const status = reply.statusCode
    
    server.log.info({
      sub: sub.substring(0, 20),
      method,
      route,
      status,
      responseTime: reply.getResponseTime()
    }, `${method} ${route} -> ${status}`)
  })
})
