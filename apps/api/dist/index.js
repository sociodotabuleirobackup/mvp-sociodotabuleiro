"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fastify_1 = __importDefault(require("fastify"));
const cors_1 = __importDefault(require("@fastify/cors"));
const rate_limit_1 = __importDefault(require("@fastify/rate-limit"));
const prisma_1 = require("./plugins/prisma");
const auth_1 = require("./plugins/auth");
const health_1 = require("./routes/health");
const sessions_1 = require("./routes/sessions");
const users_1 = require("./routes/users");
const bookings_1 = require("./routes/bookings");
const stripe_connect_1 = require("./routes/stripe-connect");
const server = (0, fastify_1.default)({
    logger: {
        level: process.env.LOG_LEVEL || 'info',
        transport: process.env.NODE_ENV === 'development'
            ? {
                target: 'pino-pretty',
                options: { colorize: true },
            }
            : undefined,
    },
});
server.addContentTypeParser('application/json', { parseAs: 'buffer' }, (req, body, done) => {
    if (req.url === '/api/stripe/webhook') {
        done(null, body);
    }
    else {
        try {
            const json = JSON.parse(body.toString());
            done(null, json);
        }
        catch (err) {
            done(err, undefined);
        }
    }
});
async function start() {
    try {
        // Plugins
        await server.register(cors_1.default, {
            origin: process.env.CORS_ORIGIN || true,
        });
        await server.register(rate_limit_1.default, {
            max: 100,
            timeWindow: '1 minute',
        });
        await server.register(prisma_1.prismaPlugin);
        await server.register(auth_1.authPlugin);
        // Routes
        await server.register(health_1.healthRoutes);
        await server.register(sessions_1.sessionRoutes, { prefix: '/api' });
        await server.register(users_1.userRoutes, { prefix: '/api' });
        await server.register(bookings_1.bookingRoutes, { prefix: '/api' });
        await server.register(stripe_connect_1.stripeConnectRoutes, { prefix: '/api' });
        // Start server
        const port = Number(process.env.PORT) || 3001;
        const host = process.env.HOST || 'localhost';
        await server.listen({ port, host });
        server.log.info(`🚀 API Server ready at http://${host}:${port}`);
    }
    catch (err) {
        server.log.error(err);
        process.exit(1);
    }
}
start();
