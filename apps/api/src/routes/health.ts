
import { FastifyInstance } from 'fastify';

export async function healthRoutes(app: FastifyInstance) {
  app.get('/healthz', async () => {
    return { status: 'ok', timestamp: new Date().toISOString() };
  });
}
