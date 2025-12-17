
import Fastify from 'fastify';
import cors from '@fastify/cors';
import rateLimit from '@fastify/rate-limit';
import prismaPlugin from './plugins/prisma.ts';
import authPlugin from './plugins/auth.ts';
import { healthRoutes } from './routes/health.ts';
import { sessionRoutes } from './routes/sessions.ts';

const server = Fastify({
  logger: {
    transport: {
      target: 'pino-pretty',
      options: { colorize: true }
    }
  }
});

async function start() {
  try {
    // 1. Plugins de Segurança e Utilidade
    await server.register(cors, { origin: '*' });
    await server.register(rateLimit, { max: 100, timeWindow: '1 minute' });
    
    // 2. Plugins de Integração
    await server.register(prismaPlugin);
    await server.register(authPlugin);

    // 3. Rotas
    await server.register(healthRoutes);
    await server.register(sessionRoutes);

    // 4. Execução
    const port = Number(process.env.PORT) || 3333;
    await server.listen({ port, host: '0.0.0.0' });
    
    console.log(`🚀 API Server ready at http://localhost:${port}`);
  } catch (err) {
    server.log.error(err);
    (process as any).exit(1);
  }
}

start();
