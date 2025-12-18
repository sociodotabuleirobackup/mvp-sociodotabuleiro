import Fastify from 'fastify';
import cors from '@fastify/cors';
import rateLimit from '@fastify/rate-limit';
import { prismaPlugin } from './plugins/prisma';
import { authPlugin } from './plugins/auth';
import { healthRoutes } from './routes/health';
import { sessionRoutes } from './routes/sessions';
import { userRoutes } from './routes/users';
const server = Fastify({
    logger: {
        level: process.env.LOG_LEVEL || 'info',
        transport: process.env.NODE_ENV === 'development' ? {
            target: 'pino-pretty',
            options: { colorize: true }
        } : undefined
    }
});
async function start() {
    try {
        // Plugins
        await server.register(cors, {
            origin: process.env.CORS_ORIGIN || true
        });
        await server.register(rateLimit, {
            max: 100,
            timeWindow: '1 minute'
        });
        await server.register(prismaPlugin);
        await server.register(authPlugin);
        // Routes
        await server.register(healthRoutes);
        await server.register(sessionRoutes, { prefix: '/api' });
        await server.register(userRoutes, { prefix: '/api' });
        // Start server
        const port = Number(process.env.PORT) || 3001;
        const host = process.env.HOST || '0.0.0.0';
        await server.listen({ port, host });
        server.log.info(`🚀 API Server ready at http://${host}:${port}`);
    }
    catch (err) {
        server.log.error(err);
        process.exit(1);
    }
}
start();
